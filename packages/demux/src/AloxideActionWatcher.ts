import { BaseActionWatcher, AbstractActionHandler, AbstractActionReader } from 'demux';

/**
 * Allow to watch the blockchain once, just get only one block and stop.
 * For example, allow running watcher as a lambda function and let clients handle polling mechanism.
 */
export class AloxideActionWatcher extends BaseActionWatcher {
  constructor(
    protected actionReader: AbstractActionReader,
    protected actionHandler: AbstractActionHandler,
    protected pollInterval: number) {
    super(actionReader, actionHandler, pollInterval);
  }

  public async watchOnce(isReplay: boolean = false) {
    try {
      const nextBlock = await this.actionReader.getNextBlock();
      const nextBlockNumberNeeded = await this.actionHandler.handleBlock(nextBlock, isReplay);

      if (nextBlockNumberNeeded)
        await this.actionReader.seekToBlock(nextBlockNumberNeeded);
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }
}
