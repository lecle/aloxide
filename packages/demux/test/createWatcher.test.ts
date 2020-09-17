import { FieldTypeEnum } from '@aloxide/bridge';
import { BaseActionWatcher } from 'demux';

import { AloxideDataManager, createWatcher, CreateWatcherConfig } from '../src';
import loggerTest from './loggerTest';

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
    logger: loggerTest,
  };

  it('throw error if missing of data provider', async () => {
    expect(() => createWatcher(config)).rejects.toThrow(
      'Missing data provider name: DemuxIndexState_any',
    );
  });

  const dataAdapter = new AloxideDataManager({
    dataProviderMap: new Map(),
  });

  dataAdapter.dataProviderMap.set('DemuxIndexState_any', {
    name: 'DemuxIndexState_any',
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  });

  dataAdapter.dataProviderMap.set('e1', {
    name: 'e1',
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  });

  it('return an watcher', async () => {
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

    const watcher = await createWatcher(config);
    expect(watcher).toBeInstanceOf(BaseActionWatcher);
  });

  it('return an watcher', async () => {
    config.dataAdapter = dataAdapter;
    config.handlerVersions = [];

    const watcher = await createWatcher(config);
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
    const watcher2 = await createWatcher(config);
    expect(watcher2).toBeInstanceOf(BaseActionWatcher);
  });

  it('return an watcher', async () => {
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

    const watcher = await createWatcher(config);
    expect(watcher).toBeInstanceOf(BaseActionWatcher);
  });
});
