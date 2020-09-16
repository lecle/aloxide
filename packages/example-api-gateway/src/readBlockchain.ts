import { readAloxideConfig } from '@aloxide/abstraction';
import { AloxideDataManager, createWatcher } from '@aloxide/demux';
import { IconActionReader } from '@aloxide/demux-icon';
import { NodeosActionReader } from 'demux-eos';

import config from './config';
import { DemuxIndexState_eos, DemuxIndexState_icon, Poll, Vote } from './models';

const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);
const dataAdapter: AloxideDataManager = new AloxideDataManager({
  dataProviderMap: new Map(),
});

dataAdapter.dataProviderMap.set(Poll.name, Poll);
dataAdapter.dataProviderMap.set(Vote.name, Vote);
dataAdapter.dataProviderMap.set(DemuxIndexState_eos.name, DemuxIndexState_eos);
dataAdapter.dataProviderMap.set(DemuxIndexState_icon.name, DemuxIndexState_icon);

//
// watch EOS
createWatcher({
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
    logLevel: 'debug',
    logSource: 'sync-EOS',
  },
})
  .then(actionWatcher => {
    if (process.env.app_enable_eos == 'true') {
      logger.info('EOS enabled');
      actionWatcher.start();
    }
  })
  .catch(err => {
    logger?.error('---- createWatcher error:', err);
  });

// watch ICON
createWatcher({
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
      actionWatcher.start();
    }
  })
  .catch(err => {
    logger.error('---- createWatcher error:', err);
  });
