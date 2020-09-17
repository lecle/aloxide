import { createLogger, Logger } from '@aloxide/logger';
import path from 'path';

import { ContractAdapter } from './ContractAdapter';
import { AbsTypeInterpreter } from './interpreter/AbsTypeInterpreter';
import { EntityConfig } from './type-definition/EntityConfig';

export abstract class AbsContractAdapter implements ContractAdapter {
  entityConfigs: EntityConfig[];
  logger?: Logger = createLogger();
  templatePath: string;
  outputPath: string;
  contractName: string;
  typeInterpreter: AbsTypeInterpreter;

  constructor(protected blockchainType: string) {}

  generate(outputPath: string) {
    this.logger.debug(`output path is: ${outputPath}, blockchain type: ${this.blockchainType}`);

    // read template from node_modules folder
    this.templatePath = path.resolve(
      path.dirname(require.resolve('@aloxide/bridge')),
      '../smart-contract-templates',
    );

    this.outputPath = path.resolve(outputPath, this.blockchainType);

    this.generateFromTemplate();
  }

  abstract generateFromTemplate();
}
