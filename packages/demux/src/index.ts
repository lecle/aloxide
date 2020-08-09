import { ModelBuilder, ModelBuilderConfig } from '@aloxide/model';
import { AbstractActionHandler, AbstractActionReader, BaseActionWatcher, HandlerVersion } from 'demux';
import { NodeosActionReader } from 'demux-eos';
import { NodeosActionReaderOptions } from 'demux-eos/dist/interfaces';
import { Sequelize } from 'sequelize';

import { AbsDbUpdater } from './AbsDbUpdater';
import { ActionHandler } from './ActionHandler';
import { BaseHandlerVersion } from './BaseHandlerVersion';
import { DbCreUpdater } from './DbCreUpdater';
import { DbDelUpdater } from './DbDelUpdater';
import { DbUpdUpdater } from './DbUpdUpdater';

export interface CreateWatcherConfig {
  accountName: string;
  modelBuilderConfig: ModelBuilderConfig;
  sequelize: Sequelize;
  pollInterval?: number;
  versionName?: string;
  modelBuilder?: ModelBuilder;
  /**
   * nodeActionReaderOptions is required if actionReader is null
   */
  nodeActionReaderOptions?: NodeosActionReaderOptions;
  actionReader?: AbstractActionReader;
  handlerVersion?: HandlerVersion;
  actionHandler?: AbstractActionHandler;
}

export async function createWatcher(config: CreateWatcherConfig): Promise<BaseActionWatcher> {
  const {
    accountName,
    versionName = 'v1',
    pollInterval = 2000,
    modelBuilderConfig: { aloxideConfigPath, logger },
    sequelize,
    nodeActionReaderOptions,
  } = config;

  let { modelBuilder, actionReader, handlerVersion, actionHandler } = config;

  if (!modelBuilder) {
    modelBuilder = new ModelBuilder({
      aloxideConfigPath,
      logger,
    });
  }

  modelBuilder.build(sequelize);

  const aloxideConfig = modelBuilder.aloxideConfig;

  if (!actionHandler) {
    if (!handlerVersion) {
      handlerVersion = new BaseHandlerVersion(
        versionName,
        aloxideConfig.entities
          .map<AbsDbUpdater[]>(({ name }) => {
            const actionName = name.substr(0, 9).toLowerCase();
            return [
              new DbCreUpdater({
                actionType: `${accountName}::cre${actionName}`,
                modelName: name,
                sequelize,
                logger,
              }),
              new DbUpdUpdater({
                actionType: `${accountName}::upd${actionName}`,
                modelName: name,
                sequelize,
                logger,
              }),
              new DbDelUpdater({
                actionType: `${accountName}::del${actionName}`,
                modelName: name,
                sequelize,
                logger,
              }),
            ];
          })
          .reduce<AbsDbUpdater[]>((a, c) => a.concat(c), []),
        [],
      );
    }

    actionHandler = new ActionHandler(handlerVersion, sequelize, logger);
  }

  if (!actionReader) {
    if (!nodeActionReaderOptions) {
      throw new Error('nodeActionReaderOptions is required if actionReader is not provided');
    }

    if (nodeActionReaderOptions.startAtBlock == null) {
      await actionHandler.initialize();
      nodeActionReaderOptions.startAtBlock = actionHandler.lastProcessedBlockNumber;
      logger?.debug(
        '-- set nodeActionReaderOptions.startAtBlock to ',
        nodeActionReaderOptions.startAtBlock,
      );
    }

    actionReader = new NodeosActionReader(nodeActionReaderOptions);
  }

  return new BaseActionWatcher(actionReader, actionHandler, pollInterval);
}
