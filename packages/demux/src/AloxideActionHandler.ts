import { EntityConfig } from '@aloxide/bridge/src';
import { AbstractActionHandler } from 'demux';

import { indexStateSchema } from './indexStateSchema';

import type { NextBlock, HandlerVersion, IndexState, ActionHandlerOptions } from 'demux';
import type { DataAdapter } from './DataAdapter';
import type { DMeta } from './DMeta';

interface IndexStateModel extends IndexState {
  id: number;
}

export interface AloxideActionHandlerOptions extends ActionHandlerOptions {
  indexStateModelName?: string;
}

export class AloxideActionHandler extends AbstractActionHandler {
  state: any = {};
  stateHistory: any = {};
  stateHistoryMaxLength = 300;
  indexStateModel: IndexStateModel;
  indexStateEntity: EntityConfig = indexStateSchema;

  protected indexStateModelName: string;

  constructor(
    protected bcName: string,
    protected dataAdapter: DataAdapter<any, any>,
    handlerVersions: HandlerVersion[],
    options?: AloxideActionHandlerOptions,
  ) {
    super(handlerVersions, options);
    if (options) {
      this.indexStateModelName = options.indexStateModelName;
    }
  }

  getIndexStateModelName() {
    return this.indexStateModelName || `DemuxIndexState_${this.bcName.replace(/\W+/, '_')}`;
  }

  protected updateIndexState(
    state: any,
    nextBlock: NextBlock,
    isReplay: boolean,
    handlerVersionName: string,
    context?: any,
  ): Promise<void> {
    const block = nextBlock.block;

    this.indexStateModel.blockNumber = block.blockInfo.blockNumber;
    this.indexStateModel.blockHash = block.blockInfo.blockHash;
    this.indexStateModel.isReplay = isReplay;
    this.indexStateModel.handlerVersionName = handlerVersionName;

    return this.dataAdapter
      .update(this.getIndexStateModelName(), this.indexStateModel, {
        entity: this.indexStateEntity,
      })
      .catch(err => {
        this.log.error('---- demux updateIndexState error:', err);
      })
      .then<void>(() => {});
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
    await handle(this.state);

    const { blockNumber } = this.indexStateModel;

    this.stateHistory[blockNumber] = JSON.parse(JSON.stringify(this.state));

    if (
      blockNumber > this.stateHistoryMaxLength &&
      this.stateHistory[blockNumber - this.stateHistoryMaxLength]
    ) {
      delete this.stateHistory[blockNumber - this.stateHistoryMaxLength];
    }
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
    const latestBlockNumber = this.indexStateModel.blockNumber;

    const toDelete = [...Array(latestBlockNumber - blockNumber).keys()].map(
      n => n + blockNumber + 1,
    );

    for (const n of toDelete) {
      delete this.stateHistory[n];
    }

    this.state = this.stateHistory[blockNumber];
  }
}
