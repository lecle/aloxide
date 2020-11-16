import { FieldTypeEnum } from '@aloxide/bridge';
import { BaseActionWatcher } from 'demux';

import {
  AloxideDataManager,
  BaseHandlerVersion,
  createDbUpdater,
  createWatcher,
  CreateWatcherConfig,
} from '../src';
import createLoggerTest from './createLoggerTest';

describe('test createWatcher', () => {
  const config: CreateWatcherConfig = {
    bcName: 'any',
    accountName: 'account_name',
    actionReader: {
      getNextBlock: jest.fn(),
      info: {
        currentBlockNumber: 0,
        startAtBlock: 100,
        headBlockNumber: 102,
      },
      initialize: jest.fn(),
      seekToBlock: jest.fn(),
    },
    dataAdapter: new AloxideDataManager({
      dataProviderMap: new Map(),
    }),
    aloxideConfig: {
      entities: [],
    },
    logger: createLoggerTest(),
  };

  it('throw error if missing of data provider', () => {
    expect(() => {
      createWatcher(config);
    }).toThrow('Missing data provider name: DemuxIndexState_any');
  });

  const dataAdapter = new AloxideDataManager({
    dataProviderMap: new Map(),
  });

  dataAdapter.dataProviderMap.set('DemuxIndexState_any', {
    name: 'DemuxIndexState_any',
    count: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  });

  dataAdapter.dataProviderMap.set('e1', {
    name: 'e1',
    count: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  });

  it('return an watcher', () => {
    config.dataAdapter = dataAdapter;
    config.aloxideConfig.entities.push({
      name: 'e1',
      fields: [
        {
          name: 'f1',
          type: FieldTypeEnum.string,
        },
      ],
      key: 'f1',
    });

    const watcher = createWatcher(config);
    expect(watcher).toBeInstanceOf(BaseActionWatcher);
  });

  it('return an watcher', () => {
    const logger = createLoggerTest();

    config.dataAdapter = dataAdapter;
    config.handlerVersions = [
      new BaseHandlerVersion(
        'v1',
        createDbUpdater(config.accountName, dataAdapter, config.aloxideConfig.entities, logger),
        [],
      ),
    ];

    const watcher = createWatcher(config);
    expect(watcher).toBeInstanceOf(BaseActionWatcher);

    config.actionHandler = {
      handleBlock: jest.fn(),
      info: {
        lastProcessedBlockNumber: 5,
        lastProcessedBlockHash: '33',
        lastIrreversibleBlockNumber: 2,
        handlerVersionName: 'v1',
      },
      initialize: jest.fn(),
    };
    const watcher2 = createWatcher(config);
    expect(watcher2).toBeInstanceOf(BaseActionWatcher);
  });

  it('return an watcher', () => {
    config.dataAdapter = dataAdapter;

    config.actionHandler = {
      handleBlock: jest.fn(),
      info: {
        lastProcessedBlockNumber: 5,
        lastProcessedBlockHash: '33',
        lastIrreversibleBlockNumber: 2,
        handlerVersionName: 'v1',
      },
      initialize: jest.fn(),
    };

    const watcher = createWatcher(config);
    expect(watcher).toBeInstanceOf(BaseActionWatcher);
  });
});
