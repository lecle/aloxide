import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from '../AbsContractAdapter';
import { ActionCreator } from '../ActionCreator';
import { CplusplusPrettier } from '../prettier/CplusplusPrettier';
import { FilePrinter } from '../printer/FilePrinter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';
import { EOSCreAction } from './EOSCreAction';
import { EOSDelAction } from './EOSDelAction';
import { EOSTypeInterpreter } from './EOSTypeInterpreter';
import { EOSUpdAction } from './EOSUpdAction';

import type { Printer } from '../printer/Printer';
import type { Table } from '../type-definition/Table';
import type { Action } from '../type-definition/Action';
import type { ContractAdapterConfig } from '../type-definition/ContractAdapterConfig';

export class EOSContractAdapter extends AbsContractAdapter {
  actions: Action[];
  tables: Table[];
  actionCreators: ActionCreator[];
  printer: Printer;

  constructor(config?: ContractAdapterConfig) {
    super(config);
    if (!this.blockchainType) {
      this.blockchainType = 'eos';
    }

    this.typeInterpreter = new EOSTypeInterpreter();
  }

  generateFromTemplate() {
    this.templatePath = path.resolve(this.templatePath, this.blockchainType);

    this.actionCreators = [new EOSCreAction(), new EOSUpdAction(), new EOSDelAction()];
    this.actionCreators.forEach(ac => {
      ac.templatePath = this.templatePath;
      ac.logDataOnly = this.logDataOnly;
    });

    this.printer = new FilePrinter(this.outputPath, new CplusplusPrettier(), this.logger);

    this.createTables();
    this.createActions();
    this.generateCpp();
    this.generateHpp();
  }

  /**
   * make tables from entity config
   */
  createTables() {
    this.tables = this.entityConfigs?.map<Table>(item => {
      const fields = item.fields.map(({ name, type }) => ({
        name,
        type: this.typeInterpreter.interpret(type as FieldTypeEnum),
      }));

      return {
        name: item.name.substr(0, 12).toLowerCase(),
        fields,
        primaryKeyField: fields.find(({ name }) => name == item.key),
      };
    });
  }

  /**
   * make actions from entity config
   */
  createActions() {
    this.actions = this.tables
      ?.map<Action[]>(item => this.actionCreators.map(ac => ac.create(item)))
      .reduce<Action[]>((a, c) => a.concat(c), []);
  }

  generateCpp() {
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, 'hello.cpp.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate, {
      noEscape: true,
    });

    // translate
    const outText = template({
      _config: {
        logDataOnly: this.logDataOnly,
      },
      contractName: this.contractName,
      actions: this.actions,
    });

    const fileName = `${this.contractName}.cpp`;

    this.printer.print(fileName, outText);
  }

  generateHpp() {
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, 'hello.hpp.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate, {
      noEscape: true,
    });

    // translate
    const outText = template({
      contractName: this.contractName,
      actions: this.actions,
      tables: this.tables,
    });

    const fileName = `${this.contractName}.hpp`;

    this.printer.print(fileName, outText);
  }
}
