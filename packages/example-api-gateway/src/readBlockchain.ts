import { readAloxideConfig } from '@aloxide/abstraction';
import { AloxideDataManager, createWatcher } from '@aloxide/demux';
import { IconActionReader } from '@aloxide/demux-icon';
import { NodeosActionReader } from 'demux-eos';

import config, { connectDb } from './config';
import { createDataProvider } from './models';

(async () => {
  const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);
  const dataAdapter: AloxideDataManager = new AloxideDataManager({
    dataProviderMap: new Map(),
  });

  const watcherTasks = [];

  if (process.env.app_enable_eos == 'true') {
    logger?.info('EOS enabled');
    const sequelize = config.sequelize;

    const indexStateModelName = 'is_eos';

    dataAdapter.dataProviderMap.set(
      indexStateModelName,
      createDataProvider(sequelize, indexStateModelName, indexStateModelName, true),
    );

    dataAdapter.dataProviderMap.set('Poll', createDataProvider(sequelize, 'Poll', 'Poll'));
    dataAdapter.dataProviderMap.set('Vote', createDataProvider(sequelize, 'Vote', 'Vote'));

    // watch EOS
    const eosActionWatcher = createWatcher({
      bcName: 'eos',
      accountName: process.env.app_d_eos_account_name,
      aloxideConfig,
      dataAdapter,
      logger: config.logger,
      actionReader: new NodeosActionReader({
        nodeosEndpoint: process.env.app_nodeosEndpoint,
        onlyIrreversible: false,
        startAtBlock: parseInt(process.env.app_startAtBlock, 10),
      }),
      actionWatcherOptions: {
        pollInterval: 5000,
        logLevel: 'info',
        logSource: 'sync-EOS',
      },
      actionHandlerOptions: {
        logLevel: 'info',
        logSource: 'handler-EOS',
        indexStateModelName,
      },
    });

    watcherTasks.push(eosActionWatcher.start());
  }

  if (process.env.app_enable_icon == 'true') {
    logger?.info('ICON enabled');
    const sequelize = connectDb(process.env.app_postgres_db_icon);
    const indexStateModelName = 'is_icon';

    dataAdapter.dataProviderMap.set(
      indexStateModelName,
      createDataProvider(sequelize, indexStateModelName, indexStateModelName, true),
    );

    dataAdapter.dataProviderMap.set('Poll', createDataProvider(sequelize, 'Poll', 'Poll'));
    dataAdapter.dataProviderMap.set('Vote', createDataProvider(sequelize, 'Vote', 'Vote'));

    // watch ICON
    const iconActionWatcher = createWatcher({
      bcName: 'icon',
      accountName: 'cxd1c341cba5d21f5c1ea36bade8369270a2fe065c',
      aloxideConfig,
      dataAdapter,
      logger: config.logger,
      actionReader: new IconActionReader({
        endpoint: process.env.app_icon_endpoint,
        nid: parseInt(process.env.app_icon_nid, 10),
        logLevel: 'info',
        logSource: 'reader-ICON',
        /**
         * https://bicon.tracker.solidwallet.io/block/6536668
         */
        startAtBlock: parseInt(process.env.app_icon_startAtBlock, 10),
        numRetries: 5,
        waitTimeMs: 1000,
      }),
      actionWatcherOptions: {
        pollInterval: 2000,
        logLevel: 'info',
        logSource: 'sync-ICON',
      },
      actionHandlerOptions: {
        logLevel: 'info',
        logSource: 'handler-ICON',
        indexStateModelName,
      },
    });

    watcherTasks.push(iconActionWatcher.start());

    return Promise.all(watcherTasks);
  }
})().catch(err => {
  logger?.error('---- createWatcher error: ', err);
});
