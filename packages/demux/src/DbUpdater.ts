import type { ActionCallback, BlockInfo, Updater } from 'demux';
import type { EntityConfig } from '@aloxide/bridge';
import type { DataAdapter } from './DataAdapter';
import type { Logger } from './Logger';
import type { AloxideActionHandlerContext } from './AloxideActionHandler';

export interface DbUpdaterOptions<ID, D> {
  actionType: string;
  entity: EntityConfig;
  dataAdapter: DataAdapter<ID, D>;
  logger?: Logger;
}

export interface DbUpdaterActionPayload {
  data: any;
  [key: string]: any;
}

/**
 * An implementation of updater which uses DataAdaper to abstract the
 * database layer
 */
export class DbUpdater<ID, D> implements Updater {
  entity: EntityConfig;
  actionType: string;
  dataAdapter: DataAdapter<ID, D>;
  logger?: Logger;
  revert?: ActionCallback;

  constructor(options: DbUpdaterOptions<ID, D>) {
    this.actionType = options.actionType;
    this.entity = options.entity;
    this.logger = options.logger;
    this.dataAdapter = options.dataAdapter;
  }

  apply: ActionCallback = (
    state: any,
    payload: DbUpdaterActionPayload,
    blockInfo: BlockInfo,
    context: AloxideActionHandlerContext,
  ): Promise<void> => {
    if (!payload.data) {
      this.logger?.warn('payload.data is null');
      return Promise.resolve();
    }

    let obj = { ...payload.data };

    if (obj.user) {
      delete obj.user;
    }

    obj = Object.freeze(obj);

    const metaData = {
      blockInfo,
      entity: this.entity,
      context,
    };

    if (this.actionType.indexOf('::cre') != -1) {
      return this.dataAdapter.create(this.entity.name, obj, metaData).then(() => {});
    } else if (this.actionType.indexOf('::upd') != -1) {
      return this.dataAdapter.update(this.entity.name, obj, metaData).then(() => {});
    } else if (this.actionType.indexOf('::del') != -1) {
      return this.dataAdapter
        .delete(this.entity.name, obj[this.entity.key], metaData)
        .then(() => {});
    }

    this.logger?.warn(`don't know action type: ${this.actionType}`);
    return Promise.resolve();
  };
}
