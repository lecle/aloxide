import { createLogger, Logger } from '@aloxide/logger';

import { readAloxideConfig } from './readAloxideConfig';
import { validateSchema } from './SchemaValidator';

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

  validateEntity() {

    const checkName = val => {
      return /^[1-5a-zA-Z]+/.test(val)
    }

    const checkType = val => {
      const supportedType = ["uint64_t", "number", "string", "array", "bool"];
      return supportedType.indexOf(val) !== -1
    }

    const requiredSchema = {
      entities: [{
        name: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
        fields: [{
          name: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
          type: { type: String, required: true, use: { checkType } },
        }],
        key: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } }
      }
      ]
    }
    let schemaErrors = validateSchema(this.aloxideConfig, requiredSchema, this.logger)

    return schemaErrors.length < 1;
  }

  generate() {
    if (!this.validateEntity()) {
      throw new Error('input entities mismatch');
    }
    if (!this.config.resultPath) {
      throw new Error('missing resultPath');
    }

    if (this.config.adapter) {
      this.config.adapter.generate(this.config.resultPath);
    }
  }
}
