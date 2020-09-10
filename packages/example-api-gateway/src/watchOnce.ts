import dote from 'dotenv-extended';
import {
  AbstractActionHandler,
  BlockInfo,
  HandlerVersion,
  IndexState,
  Block,
  Updater,
} from 'demux';
import { NodeosActionReader } from 'demux-eos';
import { AloxideActionWatcher } from '../../demux/src/AloxideActionWatcher';

dote.load({
  encoding: 'utf8',
  silent: true,
  path: '.env',
  defaults: '.env.defaults',
  schema: '.env.defaults',
  errorOnMissing: true,
  errorOnExtra: true,
  errorOnRegex: false,
  includeProcessEnv: false,
  assignToProcessEnv: true,
  overrideProcessEnv: false,
});

// tslint:disable:only-arrow-functions
// tslint:disable:no-console

const state = {
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

type State = typeof state;

const stateHistory = {};
const stateHistoryMaxLength = 300;

class TestActionHandler extends AbstractActionHandler {
  async handleWithState(handle: (state: State, context?: any) => void): Promise<void> {
    await handle(state);

    const { blockNumber } = state.indexState;
    stateHistory[blockNumber] = JSON.parse(JSON.stringify(state));
    if (blockNumber > stateHistoryMaxLength && stateHistory[blockNumber - stateHistoryMaxLength]) {
      delete stateHistory[blockNumber - stateHistoryMaxLength];
    }
  }

  async loadIndexState(): Promise<IndexState> {
    return state.indexState;
  }

  // tslint:disable:no-shadowed-variable
  protected async updateIndexState(
    state: any,
    block: Block,
    isReplay: boolean,
    handlerVersionName: string,
    context?: any,
  ): Promise<void> {
    state.indexState.blockNumber = block.blockInfo.blockNumber;
    state.indexState.blockHash = block.blockInfo.blockHash;
    state.indexState.isReplay = isReplay;
    state.indexState.handlerVersionName = handlerVersionName;
  }

  async rollbackTo(blockNumber: number): Promise<void> {
  }

  async setup() {}
}

const actionType = 'eosio.msig::approve';

const updater: Updater = {
  actionType,
  apply: (state: any, payload: any, blockInfo: BlockInfo, context: any) => {
    console.log('update: ', blockInfo);
    console.log('update: ', payload);
  }
};

const handlerVersion: HandlerVersion = {
  effects: [],
  updaters: [updater],
  versionName: 'v1'
};

const actionReader = new NodeosActionReader({
  nodeosEndpoint: process.env.app_nodeosEndpoint,
  onlyIrreversible: false,
  startAtBlock: 14504805
});

const actionHandler = new TestActionHandler([handlerVersion]);
const actionWatcher = new AloxideActionWatcher(actionReader, actionHandler, 1000);

(async function () {
  await actionReader.initialize();

  try {
    await actionWatcher.watchOnce();
  } catch (error) {
    console.log(error);
  }
})();
