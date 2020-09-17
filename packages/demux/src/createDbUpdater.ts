import { DbUpdater } from './DbUpdater';

import type { EntityConfig } from '@aloxide/bridge';
import type { DataAdapter } from './DataAdapter';
import type { Logger } from './Logger';

export function createDbUpdater(
  accountName: string,
  dataAdapter: DataAdapter<any, any>,
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
          dataAdapter,
          logger,
        }),
        new DbUpdater({
          actionType: `${accountName}::upd${actionName}`,
          entity,
          dataAdapter,
          logger,
        }),
        new DbUpdater({
          actionType: `${accountName}::del${actionName}`,
          entity,
          dataAdapter,
          logger,
        }),
      ];
    })
    .reduce<DbUpdater<any, any>[]>((a, c) => a.concat(c), []);
}
