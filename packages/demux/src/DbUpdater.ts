import { ActionCallback, Updater } from 'demux';

import type { EntityConfig } from '@aloxide/bridge';
import type { DataAdapter } from './DataAdapter';
import type { Logger } from './Logger';

interface DbUpdaterOptions<ID, D> {
  actionType: string;
  entity: EntityConfig;
  dataAdaper: DataAdapter<ID, D>;
  logger?: Logger;
}

/**
 * An implementation of updater which uses DataAdaper to abstract the
 * database layer
 */
export class DbUpdater<ID, D> implements Updater {
  entity: EntityConfig;
  dataAdaper: DataAdapter<ID, D>;
  logger?: Logger;
  revert?: ActionCallback;
  actionType: string;

  constructor(options: DbUpdaterOptions<ID, D>) {
    if (options) {
      this.actionType = options.actionType;
      this.entity = options.entity;
      this.logger = options.logger;
      this.dataAdaper = options.dataAdaper;
    }
  }

  apply: ActionCallback = (state, payload, blockInfo, context) => {
    this.logger?.debug('-- DbUpdater - begin:', this.actionType);
    this.logger?.debug('blockInfo:', blockInfo);

    const obj = payload?.data;
    if (obj?.user) {
      delete obj.user;
    }

    if (this.actionType.indexOf('::cre') != -1) {
      this.dataAdaper.create(this.entity.name, obj, blockInfo);
    } else if (this.actionType.indexOf('::upd') != -1) {
      this.dataAdaper.update(this.entity.name, obj, blockInfo);
    } else if (this.actionType.indexOf('::del') != -1) {
      this.dataAdaper.delete(this.entity.name, obj[this.entity.key], blockInfo);
    }
  };
}
