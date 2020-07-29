import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from '../AbsContractAdapter';
import { ActionCreator } from '../ActionCreator';
import { FileCoder } from '../coder/FileCoder';
import mapType from '../mapType';
import { CplusplusPrettier } from '../prettier/CplusplusPrettier';
import { EOSCreAction } from './EOSCreAction';
import { EOSDelAction } from './EOSDelAction';
import { EOSUpdAction } from './EOSUpdAction';

import type { Coder } from '../coder/Coder';
import type { Table } from '../type-definition/Table';
import type { Action } from '../type-definition/Action';
export class EOSContractAdapter extends AbsContractAdapter {
  actions: Action[];
  tables: Table[];
  actionCreators: ActionCreator[];
  coder: Coder;

  constructor() {
    super('eos');
  }

  generateFromTemplate() {
    this.templatePath = path.resolve(this.templatePath, 'eos');

    this.actionCreators = [new EOSCreAction(), new EOSUpdAction(), new EOSDelAction()];
    this.actionCreators.forEach(ac => {
      ac.templatePath = this.templatePath;
    });

    this.coder = new FileCoder(this.outputPath, new CplusplusPrettier(), this.logger);

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
        type: mapType(type, this.blockchainType),
      }));

      return {
        name: item.name.substr(0, 12).toLocaleLowerCase(),
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
      contractName: this.contractName,
      actions: this.actions,
    });

    const fileName = `${this.contractName}.cpp`;

    this.coder.code(fileName, outText);
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

    this.coder.code(fileName, outText);
  }
}
