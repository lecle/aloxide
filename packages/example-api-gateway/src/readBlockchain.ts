import { createWatcher } from '@aloxide/demux';

import config from './config';

createWatcher({
  accountName: process.env.app_d_eos_account_name,
  modelBuilderConfig: {
    aloxideConfigPath: config.aloxideConfigPath,
    logger: config.logger,
  },
  sequelize: config.sequelize,
  nodeActionReaderOptions: {
    nodeosEndpoint: process.env.app_nodeosEndpoint,
    onlyIrreversible: false,
    startAtBlock: parseInt(process.env.app_startAtBlock, 10),
  },
})
  .then(actionWatcher => {
    actionWatcher.watch();
  })
  .catch(err => {
    logger?.error('---- createWatcher error:', err);
  });
