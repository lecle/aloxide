import { BaseActionWatcher } from 'demux'
import { ActionHandler, ActionReader, ActionWatcherOptions } from 'demux/dist/interfaces'

/**
 * Allow to watch the blockchain once, just get only one block and stop.
 * For example, allow running watcher as a lambda function and let clients handle polling mechanism.
 */
export class AloxideActionWatcher extends BaseActionWatcher {
  constructor(
    protected actionReader: ActionReader,
    protected actionHandler: ActionHandler,
    options: ActionWatcherOptions) {
    super(actionReader, actionHandler, options);
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
