import { AbstractActionHandler } from 'demux';
import { DataTypes, ModelCtor } from 'sequelize';

import type { Block, HandlerVersion, IndexState } from 'demux';
import type { Model, Sequelize } from 'sequelize/types';
import type { Logger } from '@aloxide/logger';

const DemuxIndexState = 'DemuxIndexState';

interface IndexStateModel extends IndexState, Model {
  id: string;
}

export class ActionHandler extends AbstractActionHandler {
  state: any = {};
  stateHistory: any = {};
  stateHistoryMaxLength = 300;
  indexStateModel: IndexStateModel;

  constructor(
    handlerVersion: HandlerVersion,
    private sequelize: Sequelize,
    private logger?: Logger,
  ) {
    super([handlerVersion]);
  }

  protected async updateIndexState(
    state: any,
    block: Block,
    isReplay: boolean,
    handlerVersionName: string,
    context?: any,
  ): Promise<void> {
    this.indexStateModel.blockNumber = block.blockInfo.blockNumber;
    this.indexStateModel.blockHash = block.blockInfo.blockHash;
    this.indexStateModel.isReplay = isReplay;
    this.indexStateModel.handlerVersionName = handlerVersionName;

    return this.indexStateModel
      .save({
        logging: false,
      })
      .catch(err => {
        this.logger?.error('---- demux updateIndexState error:', err);
      })
      .then<void>(() => {});
  }

  protected loadIndexState(): Promise<IndexState> {
    this.logger?.debug('-- demux loadIndexState - start');

    const model: ModelCtor<IndexStateModel> = this.sequelize.models[DemuxIndexState] as ModelCtor<
      IndexStateModel
    >;

    return model
      .findByPk(1)
      .then(item => {
        if (item) return item;
        return model.create({}).then(createdItem => {
          this.logger?.debug(
            '-- demux loadIndexState - create default item:',
            createdItem.getDataValue('blockNumber'),
          );
          return createdItem;
        });
      })
      .then<IndexState>(item => {
        this.indexStateModel = item;
        this.logger?.debug('-- demux loadIndexState - block:', item.getDataValue('blockNumber'));
        return item;
      })
      .catch(err => {
        this.logger?.error('---- demux loadIndexState error:', err);
        throw err;
      })
      .finally(() => {
        this.logger?.debug('-- demux loadIndexState - end');
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
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    /**
     * Table DemuxIndexState
     */
    this.sequelize.define(DemuxIndexState, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        defaultValue: 1,
      },
      blockNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      blockHash: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      isReplay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      handlerVersionName: {
        type: DataTypes.STRING,
        defaultValue: this.handlerVersionName,
      },
    });

    return this.sequelize
      .sync({ alter: true, logging: false })
      .catch(err => {
        this.logger?.error('---- demux setup error:', err);
        throw err;
      })
      .then(() => {
        this.logger?.debug('---- demux finish setup');
      });
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
