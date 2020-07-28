import { ActionCallback, Updater } from 'demux';

import config from '../config';

export class LogUpdater implements Updater {
  apply: ActionCallback = (state, payload, blockInfo, context) => {
    config.logger.info('updateTransferData:', state, payload, blockInfo, context);
  };
  revert?: ActionCallback;
  actionType: string;
  constructor(actionType?: string) {
    this.actionType = actionType;
  }
}
