import { ModelBuilder, ModelBuilderConfig } from '@aloxide/model';
import { AbstractActionHandler, AbstractActionReader, BaseActionWatcher, HandlerVersion } from 'demux';
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
  actionReader: AbstractActionReader;
  pollInterval?: number;
  versionName?: string;
  modelBuilder?: ModelBuilder;
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
    actionReader,
  } = config;

  let { modelBuilder, handlerVersion, actionHandler } = config;

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

  return new BaseActionWatcher(actionReader, actionHandler, pollInterval);
}
