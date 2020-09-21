import { ContractAdapter } from '@aloxide/bridge';

import { isObject } from './lib/isObject';
import { Logger } from './Logger';
import { readAloxideConfig } from './readAloxideConfig';
import { validateEntity } from './SchemaValidator';

import type { ContractGeneratorConfig } from './ContractGeneratorConfig';
import type { AloxideConfig } from './AloxideConfig';
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

    const { logger, adapters, contractName, ...rest } = config;
    this.contractName = contractName || '';
    this.config = rest;

    // Define logger for the generator
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = console;
    }
    this.logger.debug('-- config.aloxideConfigPath', config.aloxideConfigPath);
    this.logger.debug('-- config.resultPath', config.resultPath);

    try {
      // Check Aloxide Input config
      const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);
      if (!validateEntity(aloxideConfig, this.logger)) {
        throw new Error('Input entities mismatch!');
      }

      this.aloxideConfig = aloxideConfig;
    } catch (e) {
      throw new Error(`Invalid Aloxide config: ${e.message}`);
    }

    // Check Output config
    if (!rest.resultPath) {
      throw new Error('Missing "resultPath"!');
    }

    // Initialize adapters
    this.adapters = [];

    if (adapters) {
      this.addAdapters(adapters);
    }
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
   * Add adapters to Contract Generator so that we can communicate with the blockchain we want.
   * This function uses the instance of input adapter to push to the array.
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
            accumulator.push(this.configureAdapter(adapter));
          }

          return accumulator;
        }, []),
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
