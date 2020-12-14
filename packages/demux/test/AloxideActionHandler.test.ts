import { FieldTypeEnum } from '@aloxide/bridge';
import { HandlerVersion, NextBlock } from 'demux';

import {
  AloxideActionHandler,
  AloxideActionHandlerContext,
  AloxideDataManager,
  BaseHandlerVersion,
  DataProvider,
  DbUpdater,
  IndexStateModel,
  indexStateSchema,
} from '../src';
import createLoggerTest from './createLoggerTest';

class TestAloxideActionHandler extends AloxideActionHandler {
  get _log() {
    return this.log;
  }

  callUpdateIndexState(
    state: any,
    nextBlock: NextBlock,
    isReplay: boolean,
    handlerVersionName: string,
    context?: AloxideActionHandlerContext,
  ) {
    return this.updateIndexState(state, nextBlock, isReplay, handlerVersionName, context);
  }

  callRollbackIndexState(blockNumber) {
    return this.rollbackIndexState(blockNumber);
  }

  callLoadIndexState() {
    return this.loadIndexState();
  }

  callHandleWithState(handle: (state: any, context?: any) => void) {
    return this.handleWithState(handle);
  }

  callSetup() {
    return this.setup();
  }

  callRollbackTo(blockNumber: number) {
    return this.rollbackTo(blockNumber);
  }
}

describe('test AloxideActionHandler', () => {
  const bcName = 'eos';

  const createDataAdapter = (dataProvider?: DataProvider): [AloxideDataManager, DataProvider] => {
    const dataAdapter = new AloxideDataManager({
      dataProviderMap: new Map(),
    });

    if (!dataProvider) {
      dataProvider = {
        name: 'DemuxIndexState_eos',
        count: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn(),
      };
    }

    dataAdapter.dataProviderMap.set(dataProvider.name, dataProvider);

    return [dataAdapter, dataProvider];
  };

  const logger = createLoggerTest();

  const handlerVersions: HandlerVersion[] = [
    new BaseHandlerVersion(
      'v1',
      [
        new DbUpdater({
          actionType: 'aa',
          dataAdapter: createDataAdapter()[0],
          entity: {
            name: 'entity1',
            fields: [
              {
                name: 'key-field',
                type: FieldTypeEnum.string,
              },
              {
                name: 'field 1',
                type: FieldTypeEnum.number,
              },
            ],
            key: 'key-field',
          },
          logger,
        }),
      ],
      [],
    ),
  ];

  describe('check constructor', () => {
    it('create new object', () => {
      const [dataAdapter] = createDataAdapter();
      const handler = new AloxideActionHandler(bcName, dataAdapter, handlerVersions);

      expect(handler).toBeTruthy();
      expect(handler.getIndexStateModelName()).toEqual(
        `DemuxIndexState_${bcName.replace(/\W+/, '_')}`,
      );
    });

    it('set indexStateModelName', () => {
      const indexStateModelName = 'is_EOS';
      const [dataAdapter] = createDataAdapter();
      const handler = new AloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        indexStateModelName,
      });
      expect(handler.getIndexStateModelName()).toEqual(indexStateModelName);
    });
  });

  describe('test updateIndexState', () => {
    it('call updateIndexState with no error', async () => {
      const state = {};
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 9,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 5,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);
      handler.indexStateModel = {
        blockHash: null,
        blockNumber: null,
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      const context = {
        info: handler.info,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
      expect(handler.indexStateModel.isReplay).toEqual(isReplay);
      expect(handler.indexStateModel.handlerVersionName).toEqual(handlerVersionName);

      expect(handler.indexStateModel.liBlockNumber).toEqual(nextBlock.lastIrreversibleBlockNumber);
      expect(handler.indexStateModel.lpBlockHash).toEqual(context.info.lastProcessedBlockHash);
      expect(handler.indexStateModel.lpBlockNumber).toEqual(context.info.lastProcessedBlockNumber);
      expect(handler.indexStateModel.state).toEqual('{}');

      expect(dataProvider.update).toBeCalledWith(handler.indexStateModel, {
        entity: indexStateSchema,
      });
    });

    it('call prune history if lastIrreversibleBlockNumber change', async () => {
      const state = {};
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 11,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 5,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const deleteAuditHistory = jest.fn().mockResolvedValue(undefined);
      const rollBackData = jest.fn().mockResolvedValue(undefined);

      const handler = new TestAloxideActionHandler(
        bcName,
        dataAdapter,
        handlerVersions,
        {
          logLevel: 'info',
          logSource: 'handler-EOS',
          indexStateModelName: 'DemuxIndexState_eos',
        },
        rollBackData,
        deleteAuditHistory,
      );

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 2,
        blockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 10,
        liBlockNumber: 10,
        lpBlockNumber: 10,
        handlerVersionName: 'v1',
        isReplay: false,
      };

      const context = {
        info: handler.info,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);

      expect(deleteAuditHistory).toBeCalledTimes(1);
      expect(deleteAuditHistory).toBeCalledWith(nextBlock.lastIrreversibleBlockNumber);
    });

    it('should not call prune history if last processed block less than lastIrreversibleBlockNumber', async () => {
      const state = {};
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 5,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 15,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });
      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 10,
        blockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 4,
        liBlockNumber: 4,
        lpBlockNumber: 4,
        handlerVersionName: 'v1',
        isReplay: false,
      };

      const context = {
        info: handler.info,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
    });

    it('should not call prune history if last irreversible block number doesnt not change', async () => {
      const state = {};
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 5,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 10,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });
      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 10,
        blockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 4,
        liBlockNumber: 4,
        lpBlockNumber: 4,
        handlerVersionName: 'v1',
        isReplay: false,
      };

      const context = {
        info: handler.info,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
    });

    it('state null', async () => {
      const state = null;
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 9,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 5,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);
      handler.indexStateModel = {
        blockHash: null,
        blockNumber: null,
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      const context = {
        info: handler.info,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
      expect(handler.indexStateModel.isReplay).toEqual(isReplay);
      expect(handler.indexStateModel.handlerVersionName).toEqual(handlerVersionName);

      expect(handler.indexStateModel.liBlockNumber).toEqual(nextBlock.lastIrreversibleBlockNumber);
      expect(handler.indexStateModel.lpBlockHash).toEqual(context.info.lastProcessedBlockHash);
      expect(handler.indexStateModel.lpBlockNumber).toEqual(context.info.lastProcessedBlockNumber);
      expect(handler.indexStateModel.state).toBeNull();

      expect(dataProvider.update).toBeCalledWith(handler.indexStateModel, {
        entity: indexStateSchema,
      });
    });

    it('context null', async () => {
      const state = null;
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 9,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 5,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);
      handler.indexStateModel = {
        blockHash: null,
        blockNumber: null,
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      const context = null;

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
      expect(handler.indexStateModel.isReplay).toEqual(isReplay);
      expect(handler.indexStateModel.handlerVersionName).toEqual(handlerVersionName);
      expect(handler.indexStateModel.liBlockNumber).toBe(nextBlock.lastIrreversibleBlockNumber);

      expect(handler.indexStateModel.lpBlockHash).toBeNull();
      expect(handler.indexStateModel.lpBlockNumber).toBeNull();
      expect(handler.indexStateModel.state).toBeNull();

      expect(dataProvider.update).toBeCalledWith(handler.indexStateModel, {
        entity: indexStateSchema,
      });
    });

    it('update throw error', async () => {
      const state = {};
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '',
            blockNumber: 9,
            previousBlockHash: '',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 5,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';
      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'debug',
        logSource: 'TestAloxideActionHandler',
      });

      handler.indexStateModel = {
        blockHash: null,
        blockNumber: null,
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      const context = {
        info: handler.info,
      };
      const spyLogError = jest.spyOn(handler._log, 'error');
      spyLogError.mockImplementation(() => {});

      const err = 'update error';
      (dataProvider.update as jest.Mock).mockRejectedValue(err);

      expect(handler.getIndexStateModelName()).toEqual(dataProvider.name);

      await handler.callUpdateIndexState(state, nextBlock, isReplay, handlerVersionName, context);

      expect(handler._log.error).toBeCalledWith('---- demux updateIndexState error:', err);
    });
  });

  describe('test loadIndexState', () => {
    it('call loadIndexState with no error', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      const indexState: IndexStateModel = {
        blockHash: null,
        blockNumber: null,
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      (dataProvider.find as jest.Mock).mockResolvedValue(indexState);

      await handler.callLoadIndexState();

      expect(dataProvider.find).toBeCalledWith('v1', {
        entity: indexStateSchema,
      });
    });

    it('call loadIndexState with blockNumber is string', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      const indexState = {
        blockHash: null,
        blockNumber: '5',
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      (dataProvider.find as jest.Mock).mockResolvedValue(indexState);

      await handler.callLoadIndexState();

      expect(dataProvider.find).toBeCalledWith(handlerVersions[0].versionName, {
        entity: indexStateSchema,
      });

      expect(handler.indexStateModel).toBeTruthy();
      expect(handler.indexStateModel.blockNumber).toEqual(5);
    });

    it('find return null', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);
      (dataProvider.find as jest.Mock).mockImplementation(() => Promise.resolve());
      (dataProvider.create as jest.Mock).mockImplementation(() => Promise.resolve({}));

      await handler.callLoadIndexState();

      expect(dataProvider.find).toBeCalledWith('v1', {
        entity: indexStateSchema,
      });
      expect(dataProvider.create).toBeCalledWith(
        { blockHash: '', blockNumber: 0, handlerVersionName: 'v1', isReplay: false },
        {
          entity: indexStateSchema,
        },
      );
    });

    it('find reject', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      const err = 'error msg';
      (dataProvider.find as jest.Mock).mockRejectedValue(err);
      (dataProvider.create as jest.Mock).mockImplementation(() => Promise.resolve({}));

      const spyLogError = jest.spyOn(handler._log, 'error');
      spyLogError.mockImplementation(() => {});

      await expect(handler.callLoadIndexState()).rejects.toEqual(err);

      expect(dataProvider.find).toBeCalledWith('v1', {
        entity: indexStateSchema,
      });
      expect(spyLogError).toBeCalledWith('---- demux loadIndexState error:', err);
    });
  });

  describe('callHandleWithState', () => {
    it('call hanle with no state', async () => {
      const [dataAdapter] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      // @ts-ignore
      handler.indexStateModel = {
        state: null,
      };

      const handle = jest.fn();
      await handler.callHandleWithState(handle);

      expect(handle).toBeCalledTimes(1);
      expect(handle).toBeCalledWith(null, {
        info: handler.info,
      });
    });

    it('call hanle with state', async () => {
      const [dataAdapter] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      // @ts-ignore
      handler.indexStateModel = {
        state: '{}',
      };

      const handle = jest.fn();
      await handler.callHandleWithState(handle);

      expect(handle).toBeCalledTimes(1);
      expect(handle).toBeCalledWith(
        {},
        {
          info: handler.info,
        },
      );
    });

    it('call hanle with invalid state', async () => {
      const [dataAdapter] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      // @ts-ignore
      handler.indexStateModel = {
        state: '{e}',
      };

      const spyLogWarn = jest.spyOn(handler._log, 'warn');
      spyLogWarn.mockImplementation(() => {});

      const handle = jest.fn();
      await handler.callHandleWithState(handle);

      expect(handle).toBeCalledTimes(1);
      expect(handle).toBeCalledWith(null, {
        info: handler.info,
      });

      expect(spyLogWarn).toBeCalledWith(
        '-- can not deserialize state: {e}',
        expect.any(SyntaxError),
      );
    });
  });

  describe('callSetup', () => {
    it('call setup', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      dataProvider.setup = jest.fn();
      const spyGetIndexStateModelName = jest.spyOn(handler, 'getIndexStateModelName');

      await handler.callSetup();

      expect(dataProvider.setup).toBeCalledTimes(1);
      expect(spyGetIndexStateModelName).toBeCalledTimes(1);
    });

    it('there is no setup in data provider', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      dataAdapter.setup = null;
      const spyGetIndexStateModelName = jest.spyOn(handler, 'getIndexStateModelName');

      await handler.callSetup();

      expect(spyGetIndexStateModelName).not.toBeCalled();
    });
  });

  describe('callRollbackTo', () => {
    it('call rollbackTo', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();

      const deleteAuditHistory = jest.fn().mockResolvedValue(undefined);
      const rollBackData = jest.fn().mockResolvedValue(undefined);

      const handler = new TestAloxideActionHandler(
        bcName,
        dataAdapter,
        handlerVersions,
        {
          logLevel: 'info',
          logSource: 'handler-EOS',
          indexStateModelName: 'DemuxIndexState_eos',
        },
        rollBackData,
        deleteAuditHistory,
      );

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9898001,
        blockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 9899998,
        liBlockNumber: 9899997,
        lpBlockNumber: 9899998,
        handlerVersionName: 'v1',
        isReplay: false,
      };

      const spyLogDebug = jest.spyOn(handler._log, 'debug');
      spyLogDebug.mockImplementation(() => {});

      dataProvider.setup = jest.fn();

      const rollBlockNumber = handler.indexStateModel.lastIrreversibleBlockNumber;
      await handler.callRollbackTo(rollBlockNumber);

      expect(handler.indexStateModel.blockNumber).toBe(rollBlockNumber);
      expect(handler.indexStateModel.blockHash).toBe('');

      expect(rollBackData).toBeCalledTimes(1);
      expect(rollBackData).toBeCalledWith(rollBlockNumber);
    });

    it('should not call rollbackData function if not specify', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9898001,
        blockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 9899998,
        liBlockNumber: 9899997,
        lpBlockNumber: 9899998,
        handlerVersionName: 'v1',
        isReplay: false,
      };

      const spyLogDebug = jest.spyOn(handler._log, 'debug');
      spyLogDebug.mockImplementation(() => {});

      dataProvider.setup = jest.fn();

      const rollBlockNumber = handler.indexStateModel.lastIrreversibleBlockNumber;
      await handler.callRollbackTo(rollBlockNumber);

      expect(handler.indexStateModel.blockNumber).toBe(rollBlockNumber);
      expect(handler.indexStateModel.blockHash).toBe('');
    });
  });

  describe('call rollback index state', () => {
    it('roll back index state throw error', async () => {
      const [dataAdapter, dataProvider] = createDataAdapter();
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        blockHash: null,
        blockNumber: null,
        handlerVersionName: null,
        isReplay: null,
        lastIrreversibleBlockNumber: null,
        liBlockNumber: null,
        lpBlockHash: null,
        lpBlockNumber: null,
        state: null,
      };

      const spyLogError = jest.spyOn(handler._log, 'error');
      spyLogError.mockImplementation(() => {});

      const err = 'update error';
      (dataProvider.update as jest.Mock).mockRejectedValue(err);

      const blockNumber = 9898989;

      await handler.callRollbackIndexState(blockNumber);

      expect(handler._log.error).toBeCalledWith('---- demux updateIndexState error:', err);
    });
  });

  describe('test handle block ', () => {
    it('should handle block successfully', async () => {
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '0000270ff9e9206671a48a00061832382960054845ed4b3aca55c29776890982',
            blockNumber: 9999,
            previousBlockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 9990,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9990,
        blockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 9998,
        liBlockNumber: 9990,
        lpBlockNumber: 9998,
        handlerVersionName,
        isReplay: false,
      };

      const context = {
        info: handler.info,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));
      (dataProvider.find as jest.Mock).mockImplementation(() =>
        Promise.resolve(handler.indexStateModel),
      );

      await handler.handleBlock(nextBlock, isReplay);

      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
      expect(handler.indexStateModel.lastIrreversibleBlockNumber).toEqual(
        nextBlock.lastIrreversibleBlockNumber,
      );

      expect(dataProvider.update).toBeCalledTimes(1);
    });

    it('should roll back to last irreversible block', async () => {
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '0000270ff9e9206671a48a00061832382960054845ed4b3aca55c29776890982',
            blockNumber: 9999,
            previousBlockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 9990,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9990,
        blockHash: '000003e76755ed6228794099680e2d30ea92034a4101120e20fd45ac080e1732',
        lpBlockHash: '0312597792ca276ac1b484c62c425562e3fd3a0652c307da56169e21aaa76180',
        blockNumber: 9998,
        liBlockNumber: 9990,
        lpBlockNumber: 9998,
        handlerVersionName,
        isReplay: false,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));
      (dataProvider.find as jest.Mock).mockImplementation(() =>
        Promise.resolve(handler.indexStateModel),
      );

      const mockRollbackToLastIrreverible = jest.spyOn(
        handler,
        // @ts-ignore
        'handleRollbackToLastIreversibleBlock',
      );
      // @ts-ignore
      mockRollbackToLastIrreverible.mockResolvedValueOnce(null);

      const nextBlockNeeded = await handler.handleBlock(nextBlock, isReplay);

      expect(nextBlockNeeded).toBe(handler.indexStateModel.lastIrreversibleBlockNumber + 1);
      expect(mockRollbackToLastIrreverible).toBeCalledTimes(1);
    });

    it('should handle block normaly if lastProcessedBlockHash is empty', async () => {
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '0000270ff9e9206671a48a00061832382960054845ed4b3aca55c29776890982',
            blockNumber: 9999,
            previousBlockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 9990,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9990,
        blockHash: '',
        lpBlockHash: '',
        blockNumber: 9998,
        liBlockNumber: 9990,
        lpBlockNumber: 9998,
        handlerVersionName,
        isReplay: false,
      };

      (dataProvider.update as jest.Mock).mockImplementation(() => Promise.resolve({}));
      (dataProvider.find as jest.Mock).mockImplementation(() =>
        Promise.resolve(handler.indexStateModel),
      );

      const nextBlockNeeded = await handler.handleBlock(nextBlock, isReplay);

      expect(nextBlockNeeded).toBeNull();
      expect(handler.indexStateModel.blockNumber).toEqual(nextBlock.block.blockInfo.blockNumber);
      expect(handler.indexStateModel.blockHash).toEqual(nextBlock.block.blockInfo.blockHash);
      expect(handler.indexStateModel.lastIrreversibleBlockNumber).toEqual(
        nextBlock.lastIrreversibleBlockNumber,
      );

      expect(dataProvider.update).toBeCalledTimes(1);
    });

    it('should handle block throw error', async () => {
      const nextBlock: NextBlock = {
        block: {
          actions: [],
          blockInfo: {
            blockHash: '0000270ff9e9206671a48a00061832382960054845ed4b3aca55c29776890982',
            blockNumber: 9999,
            previousBlockHash: '0312588bb49a9b9c58e90bc8f2d2b393379a7af59caeedab48734d4a224f3dce',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isEarliestBlock: false,
          isNewBlock: true,
          isRollback: false,
        },
        lastIrreversibleBlockNumber: 9990,
      };
      const isReplay = false;
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9990,
        blockHash: '',
        lpBlockHash: '',
        blockNumber: 9998,
        liBlockNumber: 9990,
        lpBlockNumber: 9998,
        handlerVersionName,
        isReplay: false,
      };

      const errorMessage = 'can not load data';
      (dataProvider.find as jest.Mock).mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      await expect(handler.handleBlock(nextBlock, isReplay)).rejects.toThrowError(errorMessage);
    });
  });

  describe('test handle roll back to last irreversible block', () => {
    it('should handle block throw error', async () => {
      const handlerVersionName = 'v1';

      const [dataAdapter, dataProvider] = createDataAdapter();

      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions, {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName: 'DemuxIndexState_eos',
      });

      handler.indexStateModel = {
        state: '',
        lastIrreversibleBlockNumber: 9990,
        blockHash: '',
        lpBlockHash: '',
        blockNumber: 9998,
        liBlockNumber: 9990,
        lpBlockNumber: 9998,
        handlerVersionName,
        isReplay: false,
      };

      // @ts-ignore
      handler.lastIrreversibleBlockNumber = handler.indexStateModel.lastIrreversibleBlockNumber;

      // @ts-ignore
      const mockRollbackTo = jest.spyOn(handler, 'rollbackTo');
      // @ts-ignore
      mockRollbackTo.mockResolvedValueOnce(null);

      // @ts-ignore
      await handler.handleRollbackToLastIreversibleBlock();

      expect(mockRollbackTo).toBeCalledTimes(1);
      expect(mockRollbackTo).toBeCalledWith(handler.indexStateModel.lastIrreversibleBlockNumber);
    });
  });
});
