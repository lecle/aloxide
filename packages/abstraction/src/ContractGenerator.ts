import { createLogger, Logger } from '@aloxide/logger';

import { readAloxideConfig } from './readAloxideConfig';
import { validateEntity } from './SchemaValidator';

import type { ContractGeneratorConfig } from './ContractGeneratorConfig';
import type { AloxideConfig } from './AloxideConfig';
import { ContractAdapter } from '@aloxide/bridge';

import { isObject } from './lib/Utils';

export class ContractGenerator {
  aloxideConfig: AloxideConfig;
  logger: Logger;
  contractName: string; // Default Contract Name
  public config: Omit<ContractGeneratorConfig, 'logger' | 'adapters' | 'contractName'>;
  private adapters: ContractAdapter[] = [];

  constructor(config: ContractGeneratorConfig) {
    if (!config) {
      throw new Error('Missing configuration!');
    }

    const { adapters, logger, contractName, ...rest } = config;
    this.contractName = contractName || '';
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

    // Initialize adapters
    this.adapters = [];
    this.addAdapters(adapters);
  }

  /**
   * Configure/override adapter configs to use some from the generator.
   * This is a mutable function.
   */
  configureAdapter(adapter: ContractAdapter) {
    // Get `logger` config from generator
    adapter.logger = this.logger || adapter.logger;

    // Get `contractName` config from generator
    adapter.contractName = this.contractName || 'hello';

    // Get `entities` config from generator
    adapter.entityConfigs = this.aloxideConfig.entities || [];

    return adapter;
  }

  /**
   * Add adapters to Contract Generator so that we can communicate with the blockchain we want
   * @param adapters
   */
  addAdapters(adapters: ContractAdapter | ContractAdapter[]) {
    if (isObject(adapters)) {
      // Add single adapter
      this.adapters.push(this.configureAdapter(adapters as ContractAdapter));

    } else if (Array.isArray(adapters)) {
      // Add multiple adapters
      this.adapters.push(
          ...adapters.reduce((accumulator, adapter) => {
          if (adapter) {
            this.configureAdapter(adapter);

            accumulator.push(adapter);
          }

          return accumulator;
        }, [])
      );

    } else {
      throw new Error('Invalid Contract Adapter');
    }
  }

  generate() {
    // TODO: should support config Contract Name when generating smart contract
    if (Array.isArray(this.adapters)) {
      this.adapters.forEach(adapter => {
        adapter.generate(this.config.resultPath);
      });
    }
  }
}
