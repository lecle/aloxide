import { FieldTypeEnum } from '@aloxide/bridge';
import { HandlerVersion, NextBlock, AbstractActionHandler } from 'demux';
import { VersatileUpdater } from '../src/VersatileUpdater';

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
        update: jest.fn(),
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

    it('should not add any handler when there\'s no "handlers" config found', () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const addHandlerMock = jest.spyOn(AloxideActionHandler.prototype, 'addHandler');
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVersions);

      expect(actionHandler).toBeDefined();
      expect(addHandlerMock).toBeCalledTimes(0);
    });

    it('should add handler defined in "handlers" config on creation stage', () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const addHandlerMock = jest
        .spyOn(AloxideActionHandler.prototype, 'addHandler')
        .mockReturnValueOnce(true);
      const handler = () => {};
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVersions, {
        handlers: [
          {
            actionName: 'account::test_action1',
            handler,
          },
          {
            actionName: 'account::test_action2',
            handler,
          },
        ],
      });

      expect(actionHandler).toBeDefined();
      expect(addHandlerMock).toBeCalledTimes(2);
      expect(addHandlerMock.mock.calls[0]).toEqual([handler, 'account::test_action1']);
      expect(addHandlerMock.mock.calls[1]).toEqual([handler, 'account::test_action2']);
    });
  });

  describe('matchActionType()', () => {
    const adapter = new AloxideDataManager({
      dataProviderMap: new Map(),
    });
    const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVersions);

    it('should not be matched when action type and subscribed type are not equal', () => {
      let res = actionHandler.matchActionType('some_action', 'subscribed_action');
      expect(res).toBe(false);

      res = actionHandler.matchActionType('some_action', 'some_other_action');
      expect(res).toBe(false);
    });

    it('should be matched when action type and subscribed type are exactly equal', () => {
      const res = actionHandler.matchActionType('some_action', 'some_action');

      expect(res).toBe(true);
    });

    it('should be matched when subscribed type are "*" (means "all")', () => {
      let res = actionHandler.matchActionType('some_action', '*');
      expect(res).toBe(true);

      res = actionHandler.matchActionType('some_other_action', '*');
      expect(res).toBe(true);
    });
  });

  describe('applyUpdaters()', () => {
    const adapter = new AloxideDataManager({
      dataProviderMap: new Map(),
    });

    it('should add additional data to payload before further process', () => {
      const blockInfo = {
        block: {
          actions: [
            {
              type: 'type1',
              payload: {
                somedata: 'test_payload',
              },
            },
            {
              type: 'type2',
              payload: {
                somedata: 'test_payload',
              },
            },
          ],
          blockInfo: {
            blockHash: 'test_hash',
            blockNumber: 123,
            previousBlockHash: 'test_hash',
            timestamp: new Date(),
          },
        },
        blockMeta: {
          isRollback: true,
          isEarliestBlock: true,
          isNewBlock: true,
        },
        lastIrreversibleBlockNumber: 123,
      };
      const applyUpdatersParentMock = jest
        // @ts-ignore
        .spyOn(AbstractActionHandler.prototype, 'applyUpdaters')
        // @ts-ignore
        .mockReturnValueOnce('test');
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVersions);

      const res = actionHandler.applyUpdaters('test_state', blockInfo, 'context', true);

      expect(res).toBe('test');
      expect(applyUpdatersParentMock).toBeCalledTimes(1);
      expect(applyUpdatersParentMock).toBeCalledWith('test_state', blockInfo, 'context', true);
    });
  });

  describe('addUpdater()', () => {
    it('should throw error when cannot find parent handler version map', () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVersions);
      const updater = new VersatileUpdater();

      // @ts-ignore
      actionHandler.handlerVersionMap = undefined;

      expect(() => {
        actionHandler.addUpdater(updater);
      }).toThrowError('"handlerVersionMap" not found');
    });

    it('should add updater', () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const handlerVer: HandlerVersion[] = [new BaseHandlerVersion('v1', [], [])];
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVer);
      const updater = new VersatileUpdater();

      // @ts-ignore
      expect(actionHandler.handlerVersionMap[actionHandler.handlerVersionName].updaters).toEqual(
        [],
      );

      actionHandler.addUpdater(updater);
      // @ts-ignore
      expect(actionHandler.handlerVersionMap[actionHandler.handlerVersionName].updaters).toEqual([
        updater,
      ]);
    });
  });

  describe('addHandler()', () => {
    it('should warn and not allow to add handler when cannot find any Versatile Updater', () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const handlerVer: HandlerVersion[] = [new BaseHandlerVersion('v1', [], [])];
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVer);
      // @ts-ignore
      const loggerMock = (actionHandler.log.warn = jest.fn());
      const handler = () => {};

      const res = actionHandler.addHandler(handler, 'some_action');
      expect(res).toBeUndefined();
      expect(loggerMock).toBeCalledWith(
        '"addHandler" is intended to use only with Versatile Updaters which can handle all types of actions (actionType = "*")',
      );
    });

    it("should allow to add handler when there's any Versatile Updater", () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const updater = new VersatileUpdater();
      updater.addHandler = jest.fn();
      const handlerVer: HandlerVersion[] = [new BaseHandlerVersion('v1', [updater], [])];
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVer);
      // @ts-ignore
      const loggerMock = (actionHandler.log.warn = jest.fn());
      const handler = () => {};

      const res = actionHandler.addHandler(handler, 'some_action');
      expect(res).toBe(true);
      expect(loggerMock).toBeCalledTimes(0);
      expect(updater.addHandler).toBeCalledTimes(1);
    });

    it('should call addHandler() of Updaters, which can handle all types of action, to add handlers', () => {
      const adapter = new AloxideDataManager({
        dataProviderMap: new Map(),
      });
      const updater = new VersatileUpdater();
      updater.addHandler = jest.fn();
      const updater2 = new VersatileUpdater({
        actionType: 'some_action',
      });
      updater2.addHandler = jest.fn();
      const handlerVer: HandlerVersion[] = [new BaseHandlerVersion('v1', [], [])];
      const actionHandler = new AloxideActionHandler(bcName, adapter, handlerVer);
      // @ts-ignore
      actionHandler.log.warn = jest.fn();
      const handler = () => {};

      actionHandler.addUpdater(updater);
      actionHandler.addUpdater(updater2);

      const res = actionHandler.addHandler(handler, 'some_action');
      expect(res).toBe(true);

      expect(updater.addHandler).toBeCalledTimes(1);
      expect(updater.addHandler).toBeCalledWith(handler, 'some_action');
      expect(updater2.addHandler).toBeCalledTimes(0);
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

      expect(handler.indexStateModel.liBlockNumber).toEqual(
        context.info.lastIrreversibleBlockNumber,
      );
      expect(handler.indexStateModel.lpBlockHash).toEqual(context.info.lastProcessedBlockHash);
      expect(handler.indexStateModel.lpBlockNumber).toEqual(context.info.lastProcessedBlockNumber);
      expect(handler.indexStateModel.state).toEqual('{}');

      expect(dataProvider.update).toBeCalledWith(handler.indexStateModel, {
        entity: indexStateSchema,
      });
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

      expect(handler.indexStateModel.liBlockNumber).toEqual(
        context.info.lastIrreversibleBlockNumber,
      );
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

      expect(handler.indexStateModel.liBlockNumber).toBeNull();
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
      const handler = new TestAloxideActionHandler(bcName, dataAdapter, handlerVersions);

      const spyLogDebug = jest.spyOn(handler._log, 'debug');
      spyLogDebug.mockImplementation(() => {});

      dataProvider.setup = jest.fn();

      const blockNumber = 9898989;
      await handler.callRollbackTo(blockNumber);

      expect(spyLogDebug).toBeCalledTimes(1);
      expect(spyLogDebug).toBeCalledWith('-- roll back to block number:', blockNumber);
    });
  });
});
