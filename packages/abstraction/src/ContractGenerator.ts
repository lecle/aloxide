import { createLogger, Logger } from '@aloxide/logger';
import fs from 'fs';
import yaml from 'js-yaml';

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

    if (this.config.adapter) {
      this.config.adapter.logger = this.logger;
      this.config.adapter.contractName = config.contractName || 'hello';
    }

    this.readAloxidecofig(config.aloxideConfigPath);
  }

  generate() {
    if (!this.config.resultPath) {
      throw new Error('missing resultPath');
    }

    if (this.config.adapter) {
      this.config.adapter.generate(this.config.resultPath);
    }
  }

  readAloxidecofig(aloxideConfigPath: string) {
    if (!aloxideConfigPath) {
      throw new Error('missing aloxideConfigPath');
    }

    if (!fs.existsSync(aloxideConfigPath)) {
      throw new Error(`file [${aloxideConfigPath}] does not exist`);
    }

    const lowerCaseName = aloxideConfigPath.toLowerCase();

    if (lowerCaseName.endsWith('.json')) {
      this.logger.debug('parsing aloxide config with JSON format');

      // parse json
      this.aloxideConfig = JSON.parse(fs.readFileSync(aloxideConfigPath, 'utf8'));
    } else if (lowerCaseName.endsWith('.yml') || lowerCaseName.endsWith('.yaml')) {
      this.logger.debug('parsing aloxide config with YAML format');

      // parse yaml|yml
      this.aloxideConfig = yaml.safeLoad(fs.readFileSync(aloxideConfigPath, 'utf8'));
    } else {
      throw new Error(`unknow file extention of file: [${aloxideConfigPath}]`);
    }

    this.logger.debug('aloxide config:', this.aloxideConfig);

    if (this.config.adapter) {
      this.config.adapter.entityConfigs = this.aloxideConfig.entities;
    }
  }
}
