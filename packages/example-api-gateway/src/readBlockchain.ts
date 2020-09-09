import { createWatcher } from '@aloxide/demux';
import { IconActionReader } from '@aloxide/demux-icon';
import { NodeosActionReader } from 'demux-eos';

import config, { connectDb } from './config';

// watch EOS
createWatcher({
  accountName: process.env.app_d_eos_account_name,
  modelBuilderConfig: {
    aloxideConfigPath: config.aloxideConfigPath,
    logger: config.logger,
  },
  sequelize: config.sequelize,
  actionReader: new NodeosActionReader({
    nodeosEndpoint: process.env.app_nodeosEndpoint,
    onlyIrreversible: false,
    startAtBlock: parseInt(process.env.app_startAtBlock, 10),
  }),
  actionWatcherOptions: {
    pollInterval: 5000,
    logLevel: 'debug',
    logSource: 'sync-EOS',
  },
})
  .then(actionWatcher => {
    if (process.env.app_enable_eos == 'true') {
      logger.info('EOS enabled');
      actionWatcher.watch();
    }
  })
  .catch(err => {
    logger?.error('---- createWatcher error:', err);
  });

// watch ICON
createWatcher({
  accountName: 'cxd1c341cba5d21f5c1ea36bade8369270a2fe065c',
  modelBuilderConfig: {
    aloxideConfigPath: config.aloxideConfigPath,
    logger: config.logger,
  },
  sequelize: connectDb(process.env.app_postgres_db_icon),
  actionReader: new IconActionReader({
    endpoint: process.env.app_icon_endpoint,
    nid: parseInt(process.env.app_icon_nid, 10),
    logLevel: 'info',
    logSource: 'reader-ICON',
    startAtBlock: 6536668 /* https://bicon.tracker.solidwallet.io/block/6536668 */,
    numRetries: 5,
    waitTimeMs: 1000,
  }),
  actionWatcherOptions: {
    pollInterval: 2000,
    logLevel: 'debug',
    logSource: 'sync-ICON',
  },
})
  .then(actionWatcher => {
    if (process.env.app_enable_icon == 'true') {
      logger.info('ICON enabled');
      actionWatcher.watch();
    }
  })
  .catch(err => {
    logger.error('---- createWatcher error:', err);
  });
