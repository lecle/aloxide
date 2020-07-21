import { createLogger, Logger } from '@aloxide/logger';
import fs from 'fs';
import path from 'path';

import { ContractAdapter } from './ContractAdapter';
import { EntityConfig } from './EntityConfig';

export abstract class AbsContractAdapter implements ContractAdapter {
  entityConfigs: EntityConfig[];
  logger?: Logger = createLogger();
  templatePath: string;
  outputPath: string;

  constructor(protected blockchainType: string) {
    // FIXME read template from node_modules folder
    this.templatePath = path.resolve(__dirname, '../smart-contract-templates');
  }

  generate(outputPath: string) {
    this.logger.debug(`output path is: ${outputPath}, blockchain type: ${this.blockchainType}`);

    this.outputPath = path.resolve(outputPath, this.blockchainType);

    // make sure directory is exist
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, {
        recursive: true,
      });
      this.logger.debug(`make directory: ${this.outputPath}`);
    }

    this.generateFromTemplate();
  }

  abstract generateFromTemplate();
}
