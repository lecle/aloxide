import { EntityConfig, FieldTypeEnum } from '@aloxide/bridge';

import { AloxideDataManager, createDbUpdater, DbUpdater } from '../src';
import loggerTest from './loggerTest';

describe('test createDbUpdater', () => {
  it('return an array of updaters', () => {
    const accountName = 'accountName';
    const dataAdapter = new AloxideDataManager({
      dataProviderMap: new Map(),
    });
    const entities: EntityConfig[] = [
      {
        name: 'e1',
        fields: [
          {
            name: 'f1',
            type: FieldTypeEnum.string,
          },
        ],
        key: 'f1',
      },
      {
        name: 'e2',
        fields: [
          {
            name: 'f1',
            type: FieldTypeEnum.string,
          },
        ],
        key: 'f1',
      },
      {
        name: 'e3',
        fields: [
          {
            name: 'f1',
            type: FieldTypeEnum.string,
          },
        ],
        key: 'f1',
      },
    ];
    const loggers = loggerTest;

    const updaters = createDbUpdater(accountName, dataAdapter, entities, loggers);

    expect(updaters.length).toEqual(9);

    for (const updater of updaters) {
      expect(updater).toBeInstanceOf(DbUpdater);
    }
  });
});
