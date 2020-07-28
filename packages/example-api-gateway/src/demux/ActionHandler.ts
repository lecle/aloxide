import { AbstractActionHandler, Block, HandlerVersion, IndexState } from 'demux';

export class ActionHandler extends AbstractActionHandler {
  state: any;
  stateHistory: any = {};
  stateHistoryMaxLength = 300;

  constructor(handlerVersion: HandlerVersion) {
    super([handlerVersion]);

    // Fixme
    this.state = {
      volumeBySymbol: {},
      totalTransfers: 0,
      indexState: {
        blockNumber: 0,
        blockHash: '',
        isReplay: false,
        handlerVersionName: handlerVersion.versionName,
      },
    };
  }

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

  protected loadIndexState(): Promise<IndexState> {
    return this.state.indexState;
  }

  protected async handleWithState(handle: (state: any, context?: any) => void): Promise<void> {
    await handle(this.state);
    const { blockNumber } = this.state.indexState;
    this.stateHistory[blockNumber] = JSON.parse(JSON.stringify(this.state));
    if (
      blockNumber > this.stateHistoryMaxLength &&
      this.stateHistory[blockNumber - this.stateHistoryMaxLength]
    ) {
      delete this.stateHistory[blockNumber - this.stateHistoryMaxLength];
    }
  }

  protected async setup(): Promise<void> {}

  protected async rollbackTo(blockNumber: number): Promise<void> {
    const latestBlockNumber = this.state.indexState.blockNumber;
    const toDelete = [...Array(latestBlockNumber - blockNumber).keys()].map(
      n => n + blockNumber + 1,
    );
    for (const n of toDelete) {
      delete this.stateHistory[n];
    }
    this.state = this.stateHistory[blockNumber];
  }
}
