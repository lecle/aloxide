import { createLogger, Logger } from '@aloxide/logger';

import { readAloxideConfig } from './readAloxideConfig';
import { validateEntity } from './SchemaValidator';

import type { ContractGeneratorConfig } from './ContractGeneratorConfig';
import type { AloxideConfig } from './AloxideConfig';

export class ContractGenerator {
  aloxideConfig: AloxideConfig;
  logger: Logger;

  constructor(public config: ContractGeneratorConfig) {
    if (!config) {
      throw new Error('missing configuration');
    }

    const { logger, ...rest } = config;
    this.config = rest;

    // Define logger for the generator
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = createLogger();
    }
    this.logger.debug('-- config.aloxideConfigPath', config.aloxideConfigPath);
    this.logger.debug('-- config.resultPath', config.resultPath);

    // Check Input config
    const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);
    if (!validateEntity(aloxideConfig, this.logger)) {
      throw new Error('Input entities mismatch!');
    }
    this.aloxideConfig = aloxideConfig;

    // Check Output config
    if (!rest.resultPath) {
      throw new Error('Missing "resultPath"!');
    }

    if (this.config.adapter) {
      this.config.adapter.logger = this.logger;
      this.config.adapter.contractName = config.contractName || 'hello';
      this.config.adapter.entityConfigs = this.aloxideConfig.entities;
    }
  }

  generate() {
    if (this.config.adapter) {
      this.config.adapter.generate(this.config.resultPath);
    }
  }
}
