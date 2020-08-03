import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from '../AbsContractAdapter';
import { JsPrettier } from '../prettier/JsPrettier';
import { FilePrinter } from '../printer/FilePrinter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';
import { Model } from './Model';
import { ModelTypeInterpreter } from './ModelTypeInterpreter';

import type { Printer } from '../printer/Printer';

export class ModelContractAdapter extends AbsContractAdapter {
  constructor() {
    super('sequelize');
    this.typeInterpreter = new ModelTypeInterpreter();
  }

  generateFromTemplate() {
    // read template from node_modules folder
    const templatePath = (this.templatePath = path.resolve(this.templatePath, this.blockchainType));

    const hbsTemplate = fs.readFileSync(path.resolve(templatePath, 'model.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate, { noEscape: true });

    // translate
    const models = this.translateEntityConfigs();
    const outText = template({ models });

    const fileName = 'bbModelBuilder.js';

    const printer: Printer = new FilePrinter(this.outputPath, new JsPrettier(), this.logger);
    printer.print(fileName, outText);
  }

  translateEntityConfigs(): Model[] {
    return this.entityConfigs.map<Model>(item => {
      return {
        name: item.name,
        attributes: item.fields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
          primaryKey: name == item.key,
        })),
      };
    });
  }
}
