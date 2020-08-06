import { createLogger, Logger } from '@aloxide/logger';

import { readAloxideConfig } from './readAloxideConfig';

import type { ContractGeneratorConfig } from './ContractGeneratorConfig';
import type { AloxideConfig } from './AloxideConfig';

export class ContractGenerator {
  aloxideConfig: AloxideConfig;
  logger: Logger;

  constructor(public config: ContractGeneratorConfig) {
    if (!config) {
      throw new Error('missing configuration');
    }

    if (config.logger) {
      this.logger = config.logger;
    } else {
      this.logger = createLogger();
    }

    this.logger.debug('-- config.aloxideConfigPath', config.aloxideConfigPath);
    this.logger.debug('-- config.resultPath', config.resultPath);

    this.aloxideConfig = readAloxideConfig(config.aloxideConfigPath);

    if (this.config.adapter) {
      this.config.adapter.logger = this.logger;
      this.config.adapter.contractName = config.contractName || 'hello';
      this.config.adapter.entityConfigs = this.aloxideConfig.entities;
    }
  }

  generate() {
    if (!this.config.resultPath) {
      throw new Error('missing resultPath');
    }

    if (this.config.adapter) {
      this.config.adapter.generate(this.config.resultPath);
    }
  }
}
