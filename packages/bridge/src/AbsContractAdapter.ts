import path from 'path';

import type { ContractAdapter } from './ContractAdapter';
import type { AbsTypeInterpreter } from './interpreter/AbsTypeInterpreter';
import type { Logger } from './Logger';
import type { ContractAdapterConfig } from './type-definition/ContractAdapterConfig';
import type { EntityConfig } from './type-definition/EntityConfig';

export abstract class AbsContractAdapter implements ContractAdapter {
  contractName: string;
  entityConfigs: EntityConfig[];
  logger?: Logger = console;

  /**
   * Additional configs for generating template
   */
  templatePath: string;
  outputPath: string;
  typeInterpreter: AbsTypeInterpreter;
  blockchainType: string;
  logDataOnly?: boolean;
  config: ContractAdapterConfig;

  constructor(config?: ContractAdapterConfig) {
    this.config = config || {};
    this.blockchainType = this.config.blockchainType;
    this.logDataOnly = this.config.logDataOnly;
  }

  generate(outputPath: string) {
    // read template from node_modules folder
    this.templatePath = path.resolve(
      path.dirname(require.resolve('@aloxide/bridge')),
      '../smart-contract-templates',
    );

    if (this.config.outputPath) {
      this.outputPath = this.config.outputPath.startsWith('/')
        ? this.config.outputPath
        : path.resolve(outputPath, this.config.outputPath);
    } else {
      this.outputPath = path.resolve(outputPath, this.blockchainType);
    }

    this.logger.debug(
      `output path is: ${this.outputPath}, blockchain type: ${this.blockchainType}`,
    );

    this.generateFromTemplate();
  }

  abstract generateFromTemplate();
}
