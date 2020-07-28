import { ContractAdapter, EntityConfig, FieldTypeEnum, FilePrinter, JsPrettier } from '@aloxide/bridge';
import { Logger } from '@aloxide/logger';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { Model } from './Model';
import { ModelTypeInterpreter } from './ModelTypeInterpreter';

import type { Printer } from '@aloxide/bridge';
export class ModelContractAdapter implements ContractAdapter {
  contractName: string;
  entityConfigs: EntityConfig[];
  logger?: Logger;
  typeIntepreter: ModelTypeInterpreter;

  constructor() {
    this.typeIntepreter = new ModelTypeInterpreter();
  }

  generate(outputPath: string) {
    // read template from node_modules folder
    const templatePath = path.resolve(
      path.dirname(require.resolve('@aloxide/api-gateway')),
      '../hbs-template',
    );

    const hbsTemplate = fs.readFileSync(path.resolve(templatePath, 'Model.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate, { noEscape: true });

    // translate
    const models = this.translateEntityConfigs();
    const outText = template({ models });

    const printer: Printer = new FilePrinter(null, new JsPrettier(), this.logger);
    printer.print(path.basename(outputPath), outText, path.dirname(outputPath));
  }

  translateEntityConfigs(): Model[] {
    return this.entityConfigs.map<Model>(item => {
      return {
        name: item.name,
        attributes: item.fields.map(({ name, type }) => ({
          name,
          type: this.typeIntepreter.interpret(type as FieldTypeEnum),
          primaryKey: name == item.key,
        })),
      };
    });
  }
}
