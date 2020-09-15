import { BaseActionWatcher } from 'demux';

import { AloxideActionHandler } from './AloxideActionHandler';
import { BaseHandlerVersion } from './BaseHandlerVersion';
import { DbUpdater } from './DbUpdater';

import type { ActionReader, ActionHandler, HandlerVersion, ActionWatcherOptions } from 'demux';
import type { EntityConfig } from '@aloxide/bridge';
import type { Logger } from './Logger';
import type { DataAdapter } from './DataAdapter';
import type { AloxideConfig } from '@aloxide/abstraction';

export function createDbUpdater(
  accountName: string,
  dataAdaper: DataAdapter<any, any>,
  entities: EntityConfig[],
  logger: Logger,
): DbUpdater<any, any>[] {
  return entities
    .map<DbUpdater<any, any>[]>(entity => {
      const actionName = entity.name.substr(0, 9).toLowerCase();

      return [
        new DbUpdater({
          actionType: `${accountName}::cre${actionName}`,
          entity,
          dataAdaper,
          logger,
        }),
        new DbUpdater({
          actionType: `${accountName}::upd${actionName}`,
          entity,
          dataAdaper,
          logger,
        }),
        new DbUpdater({
          actionType: `${accountName}::del${actionName}`,
          entity,
          dataAdaper,
          logger,
        }),
      ];
    })
    .reduce<DbUpdater<any, any>[]>((a, c) => a.concat(c), []);
}

export interface CreateWatcherConfig {
  accountName: string;
  actionReader: ActionReader;
  dataAdaper: DataAdapter<any, any>;
  aloxideConfig: AloxideConfig;
  logger: Logger;
  versionName?: string;
  handlerVersion?: HandlerVersion;
  actionHandler?: ActionHandler;
  actionWatcherOptions?: ActionWatcherOptions;
}

export async function createWatcher(config: CreateWatcherConfig): Promise<BaseActionWatcher> {
  const {
    accountName,
    versionName = 'v1',
    actionReader,
    actionWatcherOptions,
    dataAdaper,
    aloxideConfig,
    logger,
  } = config;

  let { handlerVersion, actionHandler } = config;

  if (!actionHandler) {
    if (!handlerVersion) {
      handlerVersion = new BaseHandlerVersion(
        versionName,
        createDbUpdater(accountName, dataAdaper, aloxideConfig.entities, logger),
        [],
      );
    }

    actionHandler = new AloxideActionHandler(handlerVersion, dataAdaper, logger);
  }

  return new BaseActionWatcher(actionReader, actionHandler, actionWatcherOptions);
}
