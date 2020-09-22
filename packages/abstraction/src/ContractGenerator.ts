import { ContractAdapter } from '@aloxide/bridge';

import { Logger } from './Logger';
import { readAloxideConfig } from './readAloxideConfig';

import type { ContractGeneratorConfig } from './ContractGeneratorConfig';
import type { AloxideConfig } from './AloxideConfig';

export class ContractGenerator {
  aloxideConfig: AloxideConfig;
  logger: Logger;
  contractName: string; // Default Contract Name
  config: ContractGeneratorConfig;
  private adapters: ContractAdapter[] = [];

  constructor(config: ContractGeneratorConfig) {
    if (!config) {
      throw new Error('Missing configuration!');
    }

    this.config = config;

    const { logger, adapters, contractName } = config;
    this.contractName = contractName || '';

    // Define logger for the generator
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = console;
    }
    this.logger.debug('-- config.aloxideConfigPath', config.aloxideConfigPath);
    this.logger.debug('-- config.outputPath', config.outputPath);

    try {
      // Check Aloxide Input config
      const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);

      this.aloxideConfig = aloxideConfig;
    } catch (e) {
      throw new Error(`Invalid Aloxide config: ${e.message}`);
    }

    // Check Output config
    if (!config.outputPath) {
      throw new Error('Missing "outputPath"!');
    }

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
    adapter.logger = this.logger;

    // Get `contractName` config from generator
    adapter.contractName = this.contractName || 'hello';

    // Get `entities` config from generator
    adapter.entityConfigs = this.aloxideConfig.entities;

    if (adapter.logDataOnly == null) {
      adapter.logDataOnly = this.config.logDataOnly || false;
    }

    return adapter;
  }

  /**
   * Add adapters to Contract Generator so that we can communicate with the blockchain we want.
   * This function uses the instance of input adapter to push to the array.
   * @param adapters
   */
  addAdapters(adapters: ContractAdapter | ContractAdapter[]) {
    let _adapters: ContractAdapter[] = [];

    if (Array.isArray(adapters)) {
      _adapters = adapters;
    } else {
      _adapters.push(adapters as ContractAdapter);
    }

    _adapters.forEach(adapter => {
      this.adapters.push(this.configureAdapter(adapter));
    });
  }

  generate() {
    this.adapters.forEach(adapter => {
      adapter.generate(this.config.outputPath);
    });
  }
}
