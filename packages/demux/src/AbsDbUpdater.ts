import { ActionCallback, Updater } from 'demux';
import { Model, ModelCtor, Sequelize } from 'sequelize/types';

import type { Logger } from '@aloxide/logger';

interface DbUpdaterOptions {
  actionType: string;
  modelName: string;
  sequelize: Sequelize;
  logger?: Logger;
}

export abstract class AbsDbUpdater implements Updater {
  model: ModelCtor<Model>;
  modelName: string;
  sequelize: Sequelize;
  logger?: Logger;

  revert?: ActionCallback;
  actionType: string;

  constructor(options: DbUpdaterOptions) {
    if (options) {
      this.actionType = options.actionType;
      this.modelName = options.modelName;
      this.logger = options.logger;
      this.sequelize = options.sequelize;
    }
  }

  apply: ActionCallback = (state, payload, blockInfo, context) => {
    this.logger?.debug('-- DbUpdater - begin:');
    this.logger?.debug('blockInfo:', blockInfo);

    if (!this.model) this.model = this.sequelize.models[this.modelName];

    const obj = payload?.data;
    if (obj?.user) {
      delete obj.user;
    }

    this.handle(obj, payload?.data?.user)
      .catch(err => {
        this.logger?.error('---- handle obj error:', err);
      })
      .finally(() => {
        this.logger?.debug('-- DbUpdater - end');
      });
  };

  abstract handle(obj: any, user?: string): Promise<any>;
}
