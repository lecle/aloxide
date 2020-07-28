import { apiGateway } from '@aloxide/api-gateway';
import { ActionCallback, Updater } from 'demux';
import { Model, ModelCtor } from 'sequelize/types';

import config from '../config';

interface DbUpdaterOptions {
  actionType: string;
  modelName: string;
}

export abstract class AbsDbUpdater implements Updater {
  model: ModelCtor<Model>;
  modelName: string;

  revert?: ActionCallback;
  actionType: string;

  constructor(options: DbUpdaterOptions) {
    if (options) {
      this.actionType = options.actionType;
      this.modelName = options.modelName;
    }
  }

  apply: ActionCallback = (state, payload, blockInfo, context) => {
    config.logger.info('-- DbUpdater - begin:');
    config.logger.debug('state:', state);
    config.logger.debug('payload:', payload);
    config.logger.debug('blockInfo:', blockInfo);
    config.logger.debug('context:', context);

    this.model = apiGateway.models[this.modelName];

    const obj = payload?.data;
    if (obj?.user) {
      delete obj.user;
    }

    config.logger.debug('-- handle obj:', obj, payload?.data?.user);
    this.handle(obj, payload?.data?.user).finally(() => {
      config.logger.info('-- DbUpdater - end');
    });
  };

  abstract handle(obj: any, user?: string): Promise<any>;
}
