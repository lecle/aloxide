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
    this.logger?.info('-- DbUpdater - begin:');
    this.logger?.debug('state:', state);
    this.logger?.debug('payload:', payload);
    this.logger?.debug('blockInfo:', blockInfo);
    this.logger?.debug('context:', context);

    this.model = this.sequelize.models[this.modelName];

    const obj = payload?.data;
    if (obj?.user) {
      delete obj.user;
    }

    this.logger?.debug('-- handle obj:', obj, payload?.data?.user);
    this.handle(obj, payload?.data?.user)
      .catch(err => {
        this.logger?.error('-- handle obj error:', err);
      })
      .finally(() => {
        this.logger?.info('-- DbUpdater - end');
      });
  };

  abstract handle(obj: any, user?: string): Promise<any>;
}
