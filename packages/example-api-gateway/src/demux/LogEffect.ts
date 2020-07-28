import { Effect, StatelessActionCallback } from 'demux';

import config from '../config';

export class LogEffect implements Effect {
  run: StatelessActionCallback = (payload, blockInfo, context) => {
    config.logger.info('updateTransferData:', payload, blockInfo, context);
  };
  deferUntilIrreversible?: boolean;
  onRollback?: StatelessActionCallback;
  actionType: string;
}
