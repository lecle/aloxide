import { createWatcher } from '@aloxide/demux';

import config from './config';

createWatcher({
  accountName: 'helloworld12',
  modelBuilderConfig: {
    aloxideConfigPath: config.aloxideConfigPath,
    logger: config.logger,
  },
  sequelize: config.sequelize,
  nodeActionReaderOptions: {
    nodeosEndpoint: process.env.app_nodeosEndpoint,
    onlyIrreversible: false,
    startAtBlock: 9130000,
  },
})
  .then(actionWatcher => {
    actionWatcher.watch();
  })
  .catch(err => {
    logger?.error('---- createWatcher error:', err);
  });
