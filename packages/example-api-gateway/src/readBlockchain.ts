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
    nodeosEndpoint: 'https://testnet.canfoundation.io',
    onlyIrreversible: false,
  },
})
  .then(actionWatcher => {
    actionWatcher.watch();
  })
  .catch(err => {
    logger?.error('---- createWatcher error:', err);
  });
