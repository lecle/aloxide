import { createWatcher } from '@aloxide/demux';
import { NodeosActionReader } from 'demux-eos';

import config from './config';

const actionReader = new NodeosActionReader({
  nodeosEndpoint: process.env.app_nodeosEndpoint,
  onlyIrreversible: false,
  startAtBlock: parseInt(process.env.app_startAtBlock, 10),
});

createWatcher({
  accountName: process.env.app_d_eos_account_name,
  modelBuilderConfig: {
    aloxideConfigPath: config.aloxideConfigPath,
    logger: config.logger,
  },
  sequelize: config.sequelize,
  actionReader,
  actionWatcherOptions: {
    pollInterval: 5000,
    logLevel: 'debug',
    logSource: 'ReadBlockChain',
  },
})
  .then(actionWatcher => {
    actionWatcher.watch();
  })
  .catch(err => {
    logger?.error('---- createWatcher error:', err);
  });
