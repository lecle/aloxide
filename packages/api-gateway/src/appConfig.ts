import { ContractGeneratorConfig } from '@aloxide/abstraction';
import { ContractAdapter } from '@aloxide/bridge/src';
import { createLogger, Logger } from '@aloxide/logger';
import { Sequelize } from 'sequelize';

class AppConfig implements ContractGeneratorConfig {
  aloxideConfigPath: string;
  resultPath: string;
  adapter: ContractAdapter;
  contractName?: string;
  logger: Logger;

  modelPath: string;
  sequelize: Sequelize;
  eosEnable: boolean;
  iconEnable: boolean;

  configure(
    config: Omit<ContractGeneratorConfig, 'adapter'> & {
      eosEnable?: boolean;
      iconEnable?: boolean;
      modelPath: string;
      sequelize: Sequelize;
    },
  ) {
    Object.assign(this, config);

    if (!this.logger) {
      this.logger = createLogger();
    }
  }
}

export const appConfig = new AppConfig();
