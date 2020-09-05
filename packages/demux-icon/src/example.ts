import Logger from 'bunyan';
import {
  AbstractActionHandler,
  BaseActionWatcher,
  BlockInfo,
  Effect,
  HandlerVersion,
  IndexState,
  NextBlock,
  Updater,
} from 'demux';

import { IconActionReader } from '.';

declare global {
  var logger: Logger;
}

global.logger = Logger.createLogger({ name: 'example-demux-icon' });

// Initial state
let stateObj = {
  volumeBySymbol: {},
  totalTransfers: 0,
  indexState: {
    blockNumber: 0,
    blockHash: '',
    isReplay: false,
    handlerVersionName: 'v1',
    lastIrreversibleBlockNumber: 0,
  },
};

type State = typeof stateObj;

const stateHistory = {};
const stateHistoryMaxLength = 300;

class ObjectActionHandler extends AbstractActionHandler {
  async handleWithState(handle: (state: State, context?: any) => void): Promise<void> {
    await handle(stateObj);
    const { blockNumber } = stateObj.indexState;
    stateHistory[blockNumber] = JSON.parse(JSON.stringify(stateObj));
    if (blockNumber > stateHistoryMaxLength && stateHistory[blockNumber - stateHistoryMaxLength]) {
      delete stateHistory[blockNumber - stateHistoryMaxLength];
    }
  }

  async loadIndexState(): Promise<IndexState> {
    return stateObj.indexState;
  }

  async updateIndexState(
    state: State,
    nextBlock: NextBlock,
    isReplay: boolean,
    handlerVersionName: string,
    context?: any,
  ) {
    state.indexState.blockNumber = nextBlock.block.blockInfo.blockNumber;
    state.indexState.blockHash = nextBlock.block.blockInfo.blockHash;
    state.indexState.isReplay = isReplay;
    state.indexState.handlerVersionName = handlerVersionName;
  }

  async rollbackTo(blockNumber: number): Promise<void> {
    const latestBlockNumber = stateObj.indexState.blockNumber;
    const toDelete = [...Array(latestBlockNumber - blockNumber).keys()].map(
      n => n + blockNumber + 1,
    );
    for (const n of toDelete) {
      delete stateHistory[n];
    }
    stateObj = stateHistory[blockNumber] as State;
  }

  async setup() {}
}

/**
 * I don't know what is this smart contract yet
 * But I saw some transaction from block height below
 * {
 *  "jsonrpc": "2.0",
 *  "method": "icx_getBlockByHeight",
 *  "id": 3,
 *  "params": {
 *      "height": "0x400241"
 *    }
 *  }
 * Now I want to use updater & effect just for printing log
 */
const actionType = 'cx8eeac4eb7873a0dec7c1eec5d22c3ac925bc07f6::transfer';

const updater: Updater = {
  actionType,
  apply: (state: any, payload: any, blockInfo: BlockInfo, context: any) => {
    // TODO update state
    // logger.info('---- update state', state);
    // logger.info('---- update payload', payload);
    logger.info('---- update blockInfo', blockInfo.blockNumber);
    // logger.info('---- update context', context);
  },
};

const effect: Effect = {
  actionType,
  run: (payload: any, blockInfo: BlockInfo, context: any) => {
    // logger.info('---- effect payload', payload);
    // logger.info('---- effect blockInfo', blockInfo.blockNumber);
    // logger.info('---- effect context', context);
  },
};

const handlerVersion: HandlerVersion = {
  effects: [effect],
  updaters: [updater],
  versionName: 'v1',
};

/*
 * This ObjectActionHandler, which does not change the signature from its parent AbstractActionHandler, takes an array
 * of `HandlerVersion` objects
 */
const actionHandler = new ObjectActionHandler([handlerVersion]);

const actionReader = new IconActionReader({
  startAtBlock: 4194850,
  onlyIrreversible: false,
  endpoint: 'https://bicon.net.solidwallet.io/api/v3',
  nid: 3,
  jsonrpc: '2.0',
  logSource: 'IconActionReader',
  logLevel: 'debug',
});

/* BaseActionWatcher
 * This ready-to-use base class helps coordinate the Action Reader and Action Handler, passing through block information
 * from the Reader to the Handler. The third argument is the polling loop interval in milliseconds. Since EOS has 0.5s
 * block times, we set this to half that for an average of 125ms latency.
 *
 * All that is left to run everything is to call `watch()`.
 */
const actionWatcher = new BaseActionWatcher(actionReader, actionHandler, {
  pollInterval: 6000,
  velocitySampleSize: 1 /* default is 20 */,
});

actionWatcher.watch();
