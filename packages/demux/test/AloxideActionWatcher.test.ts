import { ActionHandler, ActionReader, ActionWatcherOptions } from 'demux';
import { AloxideActionWatcher } from '../src/AloxideActionWatcher';

describe('AloxideActionWatcher', () => {
  it('watchOnce', async () => {
    const actionReader: ActionReader = {
      getNextBlock: jest.fn(),
      info: {
        currentBlockNumber: 0,
        startAtBlock: 100,
        headBlockNumber: 102,
      },
      initialize: jest.fn(),
      seekToBlock: jest.fn(),
    };

    const actionHandler: ActionHandler = {
      handleBlock: jest.fn(),
      info: {
        lastProcessedBlockNumber: 5,
        lastProcessedBlockHash: '33',
        lastIrreversibleBlockNumber: 2,
        handlerVersionName: 'v1',
      },
      initialize: jest.fn(),
    };

    const aloxideActionWatcher = new AloxideActionWatcher(actionReader, actionHandler, {});

    // @ts-ignore
    jest.spyOn(aloxideActionWatcher.actionHandler, 'handleBlock').mockResolvedValueOnce(103);
    jest
      // @ts-ignore
      .spyOn(aloxideActionWatcher.actionReader, 'seekToBlock')
      // @ts-ignore
      .mockResolvedValueOnce(jest.fn());

    expect(aloxideActionWatcher).toBeDefined();
    await aloxideActionWatcher.watchOnce(true);
    // @ts-ignore
    expect(aloxideActionWatcher.actionHandler.handleBlock).toBeCalledTimes(1);
    // @ts-ignore
    expect(aloxideActionWatcher.actionReader.seekToBlock).toBeCalledTimes(1);
  });

  it('watchOnce', async () => {
    const actionReader: ActionReader = {
      getNextBlock: jest.fn(),
      info: {
        currentBlockNumber: 0,
        startAtBlock: 100,
        headBlockNumber: 102,
      },
      initialize: jest.fn(),
      seekToBlock: jest.fn(),
    };

    const actionHandler: ActionHandler = {
      handleBlock: jest.fn(),
      info: {
        lastProcessedBlockNumber: 5,
        lastProcessedBlockHash: '33',
        lastIrreversibleBlockNumber: 2,
        handlerVersionName: 'v1',
      },
      initialize: jest.fn(),
    };

    const aloxideActionWatcher = new AloxideActionWatcher(actionReader, actionHandler, {});

    expect(aloxideActionWatcher).toBeDefined();
    await aloxideActionWatcher.watchOnce();
  });

  it('watchOnce should throw exception', async () => {
    const actionReader: ActionReader = {
      getNextBlock: jest.fn(),
      info: {
        currentBlockNumber: 0,
        startAtBlock: 100,
        headBlockNumber: 102,
      },
      initialize: jest.fn(),
      seekToBlock: jest.fn(),
    };

    const actionHandler: ActionHandler = {
      handleBlock: jest.fn(),
      info: {
        lastProcessedBlockNumber: 5,
        lastProcessedBlockHash: '33',
        lastIrreversibleBlockNumber: 2,
        handlerVersionName: 'v1',
      },
      initialize: jest.fn(),
    };

    const aloxideActionWatcher = new AloxideActionWatcher(actionReader, actionHandler, {});
    // @ts-ignore
    const errorLog = (aloxideActionWatcher.log.error = jest.fn());

    jest
      // @ts-ignore
      .spyOn(aloxideActionWatcher.actionHandler, 'handleBlock')
      .mockRejectedValueOnce(new Error('Should throw error'));

    expect(aloxideActionWatcher).toBeDefined();
    await expect(aloxideActionWatcher.watchOnce()).rejects.toThrow(Error('Should throw error'));
    expect(errorLog).toBeCalledTimes(1);
  });
});
