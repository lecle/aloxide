import { Logger } from '@aloxide/logger';
import fs from 'fs';
import path from 'path';

import { Coder } from './Coder';

import type { Prettier } from '../prettier/Prettier';

/**
 * Print output code to files
 */
export class FileCoder implements Coder {
  constructor(private outputPath: string, public prettier: Prettier, private logger: Logger) {}

  code(fileName: string, outputText: string, outputPath?: string) {
    if (outputPath) {
      outputPath = path.resolve(this.outputPath, outputPath);
    } else {
      outputPath = this.outputPath;
    }

    const formatedOutputText = this.prettier.format(outputText, {
      semi: true,
      tabWidth: 4,
      useTabs: true,
    });

    const outFile = path.resolve(outputPath, fileName);
    this.ensureExistingFolder(outputPath);

    fs.writeFileSync(outFile, formatedOutputText);

    this.logger.info(`---- success generating file: ${outFile}`);
  }

  ensureExistingFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {
        recursive: true,
      });
      this.logger.debug(`make directory: ${folderPath}`);
    }
    return folderPath;
  }
}
