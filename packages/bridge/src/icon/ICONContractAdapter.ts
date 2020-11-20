import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from '../AbsContractAdapter';
import { JsPrettier } from '../prettier/JsPrettier';
import { PythonPrettier } from '../prettier/PythonPrettier';
import { FilePrinter } from '../printer/FilePrinter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';
import { ICONTypeInterpreter } from './ICONTypeInterpreter';

import type { Printer } from '../printer/Printer';
import type { ContractAdapterConfig } from '../type-definition/ContractAdapterConfig';

export class ICONContractAdapter extends AbsContractAdapter {
  folderName: string = 'icon_hello';
  folderTestName: string = 'tests';
  pyFilePrinter: Printer;
  jsFilePrinter: Printer;

  constructor(config?: ContractAdapterConfig) {
    super(config);
    if (!this.blockchainType) {
      this.blockchainType = 'icon';
    }
    this.typeInterpreter = new ICONTypeInterpreter();
    this.templatePath = path.resolve(this.templatePath, this.blockchainType);
  }

  generateFromTemplate() {
    if (!this.templatePath) throw new Error('Template path not found');
    this.pyFilePrinter = new FilePrinter(this.outputPath, new PythonPrettier(), this.logger);
    this.jsFilePrinter = new FilePrinter(this.outputPath, new JsPrettier(), this.logger);

    // this.coder = new FileCoder(this.outputPath, new CplusplusPrettier(), this.logger);

    this.generateInit();
    this.generatePackage();
    this.generateMainPy();
    this.generateCallAPI();
    this.generateTXAPI();

    // this.generateUnitTestPy();
    // this.generateIntegrateTestPy();
  }

  generateInit() {
    const fileName = '__init__.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);
    const outText = template({});
    this.jsFilePrinter.print(fileName, outText, this.folderName);
  }

  generatePackage() {
    const fileName = 'package.json';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    this.jsFilePrinter.print(fileName, outText, this.folderName);
  }

  generateMainPy() {
    const fileName = 'icon_hello.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    const outText = template({
      _config: {
        logDataOnly: this.logDataOnly,
      },
      tables: this.entityConfigs.map(item => {
        const key = item.fields.find(({ name }) => name == item.key);
        return {
          name: item.name.toLocaleLowerCase(),
          key: {
            name: key.name,
            type: this.typeInterpreter.interpret(key.type as FieldTypeEnum),
          },
          fields: item.fields.map(({ name, type }) => ({
            name,
            type: this.typeInterpreter.interpret(type as FieldTypeEnum),
          })),
        };
      }),
    });
    this.jsFilePrinter.print(fileName, outText, this.folderName);
  }

  generateCallAPI() {
    const fileName = 'call.json';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    this.entityConfigs.map(item => {
      const actionName = 'get' + item.name;
      const outFileName = actionName + '.json';
      const key = item.fields.find(({ name }) => name == item.key);
      const outText = template({
        key: {
          name: key.name,
          type: this.typeInterpreter.interpret(key.type as FieldTypeEnum),
        },
        action: actionName.toLocaleLowerCase(),
      });
      this.jsFilePrinter.print(outFileName, outText, this.folderName);
    });
  }

  generateTXAPI() {
    const fileName = 'tx.json';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    this.entityConfigs.map(item => {
      // create data
      const creActionName = 'cre' + item.name;
      const creFileName = creActionName + '.json';
      const creText = template({
        action: creActionName.toLocaleLowerCase(),
        fields: item.fields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
        })),
      });
      this.jsFilePrinter.print(creFileName, creText, this.folderName);

      // update data
      const udtActionName = 'upd' + item.name;
      const updFileName = udtActionName + '.json';
      const updText = template({
        action: udtActionName.toLocaleLowerCase(),
        fields: item.fields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
        })),
      });
      this.jsFilePrinter.print(updFileName, updText, this.folderName);

      // remove data
      const delActionName = 'del' + item.name;
      const delFileName = delActionName + '.json';
      const indexFields = item.fields.reduce((ids, field) => {
        if (field.name === item.key) {
          ids.push(field);
        }
        return ids;
      }, []);
      const delText = template({
        action: delActionName.toLocaleLowerCase(),
        fields: indexFields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
        })),
      });
      this.jsFilePrinter.print(delFileName, delText, this.folderName);
    });
  }
  generateUnitTestPy() {
    const fileName = 'test_unit_icon_hello.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, this.folderTestName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    this.pyFilePrinter.print(fileName, outText, path.join(this.folderName, this.folderTestName));

    // copy __init__.py
    this.pyFilePrinter.print(
      '__init__.py',
      fs.readFileSync(path.resolve(this.templatePath, this.folderName, '__init__.py'), 'utf-8'),
      path.join(this.folderName, this.folderTestName),
    );
  }

  generateIntegrateTestPy() {
    const fileName = 'test_integrate_icon_hello.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, this.folderTestName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    this.pyFilePrinter.print(fileName, outText, path.join(this.folderName, this.folderTestName));
  }
}
