import { EntityConfig } from '@aloxide/bridge/src';
import { AbstractActionHandler, MismatchedBlockHashError } from 'demux';

import { indexStateSchema } from './indexStateSchema';

import type {
  NextBlock,
  HandlerVersion,
  IndexState,
  ActionHandlerOptions,
  HandlerInfo,
} from 'demux';
import type { DataAdapter } from './DataAdapter';
import type { DMeta } from './DMeta';
import type { IndexStateModel } from './IndexStateModel';

export interface AloxideActionHandlerOptions extends ActionHandlerOptions {
  indexStateModelName?: string;
}

export interface AloxideActionHandlerContext {
  info: HandlerInfo;
}

export class AloxideActionHandler extends AbstractActionHandler {
  indexStateModel: IndexStateModel;
  indexStateEntity: EntityConfig = indexStateSchema;

  protected indexStateModelName: string;

  constructor(
    protected bcName: string,
    protected dataAdapter: DataAdapter<any, any>,
    handlerVersions: HandlerVersion[],
    options?: AloxideActionHandlerOptions,
    /*
      user define function to revert data when chain fork;
      data to be reverted from blockNumber + 1 to current last processed block number
    */
    protected rollbackData?: (blockNumber: number) => Promise<void>,
    /*
      user define function to delete audit history saved to rollback(if any);
      history to be deleted that created by block before blockNumber
    */
    protected deleteAuditHistory?: (blockNumber: number) => Promise<void>,
  ) {
    super(handlerVersions, options);
    if (options) {
      this.indexStateModelName = options.indexStateModelName;
    }
  }

  getIndexStateModelName() {
    return this.indexStateModelName || `DemuxIndexState_${this.bcName.replace(/\W+/, '_')}`;
  }

  protected async updateIndexState(
    state: any,
    nextBlock: NextBlock,
    isReplay: boolean,
    handlerVersionName: string,
    context?: AloxideActionHandlerContext,
  ): Promise<void> {
    const block = nextBlock.block;

    this.indexStateModel.blockNumber = block.blockInfo.blockNumber;
    this.indexStateModel.blockHash = block.blockInfo.blockHash;
    this.indexStateModel.isReplay = isReplay;
    this.indexStateModel.handlerVersionName = handlerVersionName;

    if (state) {
      this.indexStateModel.state = JSON.stringify(state);
    }

    if (context) {
      this.indexStateModel.lpBlockHash = context.info.lastProcessedBlockHash;
      this.indexStateModel.lpBlockNumber = context.info.lastProcessedBlockNumber;
    }

    if (
      !this.indexStateModel.liBlockNumber ||
      (+this.indexStateModel.blockNumber > +nextBlock.lastIrreversibleBlockNumber &&
        +this.indexStateModel.liBlockNumber !== +nextBlock.lastIrreversibleBlockNumber)
    ) {
      if (this.deleteAuditHistory) {
        await this.deleteAuditHistory(nextBlock.lastIrreversibleBlockNumber);
      }
    }

    this.indexStateModel.liBlockNumber = nextBlock.lastIrreversibleBlockNumber;
    this.lastIrreversibleBlockNumber = nextBlock.lastIrreversibleBlockNumber;

    return this.dataAdapter
      .update(this.getIndexStateModelName(), this.indexStateModel, {
        entity: this.indexStateEntity,
      })
      .catch(err => {
        this.log.error('---- demux updateIndexState error:', err);
      })
      .then<void>(() => {});
  }

  protected async rollbackIndexState(blockNumber: number): Promise<any> {
    this.indexStateModel.blockNumber = blockNumber;
    this.indexStateModel.blockHash = '';

    return this.dataAdapter
      .update(this.getIndexStateModelName(), this.indexStateModel, {
        entity: this.indexStateEntity,
      })
      .catch(err => {
        this.log.error('---- demux updateIndexState error:', err);
      });
  }

  protected loadIndexState(): Promise<IndexState> {
    this.log.debug('-- demux loadIndexState - start');
    const DemuxIndexState = this.getIndexStateModelName();
    const blockNumber = 0;
    const metaData: DMeta = {
      entity: this.indexStateEntity,
    };

    return this.dataAdapter
      .find(DemuxIndexState, this.handlerVersionName, metaData)
      .then(item => {
        if (item) return item;

        return this.dataAdapter
          .create(
            DemuxIndexState,
            {
              handlerVersionName: this.handlerVersionName,
              blockNumber,
              blockHash: '',
              isReplay: false,
            },
            metaData,
          )
          .then(createdItem => {
            this.log.debug('-- demux loadIndexState - create default item:', blockNumber);
            return createdItem;
          });
      })
      .then<IndexState>(item => {
        this.indexStateModel = item;
        if (typeof this.indexStateModel.blockNumber == 'string') {
          this.indexStateModel.blockNumber = parseInt(this.indexStateModel.blockNumber, 10);
        }

        this.indexStateModel.lastIrreversibleBlockNumber = +this.indexStateModel.liBlockNumber;

        this.log.debug('-- demux loadIndexState - block:', item.blockNumber);
        return item;
      })
      .catch(err => {
        this.log.error('---- demux loadIndexState error:', err);
        throw err;
      })
      .finally(() => {
        this.log.debug('-- demux loadIndexState - end');
      });
  }

  protected async handleWithState(handle: (state: any, context?: any) => void): Promise<void> {
    const context: AloxideActionHandlerContext = {
      info: this.info,
    };

    const stateString = this.indexStateModel.state;
    if (stateString) {
      try {
        const state = JSON.parse(stateString);
        return handle(state, context);
      } catch (err) {
        this.log.warn(`-- can not deserialize state: ${stateString}`, err);
      }
    }

    return handle(null, context);
  }

  public async handleBlock(nextBlock: NextBlock, isReplay: boolean): Promise<number | null> {
    try {
      return await super.handleBlock(nextBlock, isReplay);
    } catch (e) {
      if (e instanceof MismatchedBlockHashError) {
        if (this.lastProcessedBlockHash) {
          /* ActionReader store processed block info in ephemeral memory,
            in case of they lost it, they can't detect a fork and return new block to ActionHandler
            ActionHandler store lasted index state in DB, detect that fork but can detect the point of fork is
            ActionHandler should rollback to last irreversible blockNumber
            Ref https://github.com/EOSIO/demux-js/issues/123#issuecomment-465756166
          */

          // - rollbackTo should be as fast as possible to speed of sync with blockchain
          await this.handleRollbackToLastIreversibleBlock();
          return this.lastIrreversibleBlockNumber + 1;
        } else {
          /*
            this.lastProcessedBlockHash is empty,
            it means that hanlder has just processed rollback, it don't know current processed block hash is
            compare between this.lastProcessedBlockHash and NextBlock.blockHash therefore to be different
            just process NextBlock and update it to IndexState
          */

          const handleWithArgs: (state: any, context?: any) => Promise<void> = async (
            state: any,
            context: any = {},
          ) => {
            await this.handleActions(state, context, nextBlock, isReplay);
          };
          await this.handleWithState(handleWithArgs);
          return null;
        }
      }

      throw e;
    }
  }

  private async handleRollbackToLastIreversibleBlock() {
    const rollbackBlockNumber = this.lastIrreversibleBlockNumber;
    const rollbackCount = this.lastProcessedBlockNumber - rollbackBlockNumber;
    this.log.debug(`Rolling back ${rollbackCount} blocks to block ${rollbackBlockNumber}...`);
    const rollbackStart = Date.now();
    await this.rollbackTo(rollbackBlockNumber);
    // @ts-ignore
    this.rollbackDeferredEffects(this.lastIrreversibleBlockNumber);
    const rollbackTime = Date.now() - rollbackStart;
    this.log.info(
      `Rolled back ${rollbackCount} blocks to block ${rollbackBlockNumber} (${rollbackTime}ms)`,
    );
  }

  protected async setup(): Promise<void> {
    /**
     * Table DemuxIndexState
     */
    if (this.dataAdapter.setup) {
      return this.dataAdapter.setup(this.getIndexStateModelName());
    }
  }

  protected async rollbackTo(blockNumber: number): Promise<void> {
    await this.rollbackIndexState(blockNumber);
    if (this.rollbackData) {
      await this.rollbackData(blockNumber);
    }
  }
}
