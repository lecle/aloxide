import { createWatcher } from '@aloxide/demux';

import config from './config';

const actionWatcher = createWatcher({
  accountName: 'helloworld12',
  modelBuilderConfig: {
    aloxideConfigPath: config.aloxideConfigPath,
    logger: config.logger,
  },
  sequelize: config.sequelize,
  nodeActionReaderOptions: {
    nodeosEndpoint: 'https://testnet.canfoundation.io',
    onlyIrreversible: false,
    startAtBlock: -1,
  },
});

actionWatcher.watch();
