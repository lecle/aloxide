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

export class ICONContractAdapter extends AbsContractAdapter {
  folderName: string = 'icon_hello';
  folderTestName: string = 'tests';
  pyFilePrinter: Printer;
  jsFilePrinter: Printer;

  constructor() {
    super('icon');
    this.typeInterpreter = new ICONTypeInterpreter();
  }

  generateFromTemplate() {
    this.pyFilePrinter = new FilePrinter(this.outputPath, new PythonPrettier(), this.logger);
    this.jsFilePrinter = new FilePrinter(this.outputPath, new JsPrettier(), this.logger);

    // this.coder = new FileCoder(this.outputPath, new CplusplusPrettier(), this.logger);

    this.templatePath = path.resolve(this.templatePath, 'icon');

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
<<<<<<< HEAD
      tables: this.entityConfigs?.map(item => {
=======
      tables: this.entityConfigs ?.map(item => {
        let key= item.fields.find(({ name }) => name == item.key);
>>>>>>> fix(birdge): use lower;5D case for method in ICON
        return {
          name: item.name.toLocaleLowerCase(),
          key: {
            name: key.name,
            type: this.typeInterpreter.interpret(key.type as FieldTypeEnum)
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
<<<<<<< HEAD

    this.entityConfigs?.map(item => {
      const actionName = 'get' + item.name;
      const outFileName = actionName + '.json';
      const outText = template({
        action: actionName.toLocaleLowerCase(),
=======
    
    this.entityConfigs ?.map(item => {
      const actionName = "get" + item.name
      const outFileName = actionName + ".json";
      let key= item.fields.find(({ name }) => name == item.key);
      const outText = template({
        key: {
          name: key.name,
          type: this.typeInterpreter.interpret(key.type as FieldTypeEnum)
        },
        action: actionName.toLocaleLowerCase()
>>>>>>> fix(birdge): use lower;5D case for method in ICON
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

    this.entityConfigs?.map(item => {
      // create data
      const crtActionName = 'crt' + item.name;
      const crtFileName = crtActionName + '.json';
      const crtText = template({
        action: crtActionName.toLocaleLowerCase(),
        fields: item.fields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
        })),
      });
      this.jsFilePrinter.print(crtFileName, crtText, this.folderName);

      // update data
      const udtActionName = 'upt' + item.name;
      const uptFileName = udtActionName + '.json';
      const uptText = template({
        action: udtActionName.toLocaleLowerCase(),
        fields: item.fields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
        })),
      });
      this.jsFilePrinter.print(uptFileName, uptText, this.folderName);

      // remove data
<<<<<<< HEAD
      const rmvActionName = 'rmv' + item.name;
      const rmvFileName = rmvActionName + '.json';
      const rmvText = template({
        action: rmvActionName.toLocaleLowerCase(),
        fields: [{ name: 'id', type: 'int' }],
=======
      const rmvActionName = "rmv" + item.name
      const rmvFileName = rmvActionName + ".json";
      var indexFields = item.fields.reduce((ids, field) => {
        if (field.name === item.key) {
          ids.push(field);
        }
        return ids;
      }, []);
      const rmvText = template({
        action: rmvActionName.toLocaleLowerCase(),
        fields: indexFields.map(({ name, type }) => ({
          name,
          type: this.typeInterpreter.interpret(type as FieldTypeEnum),
        })),
>>>>>>> fix(birdge): use lower;5D case for method in ICON
      });
      this.jsFilePrinter.print(rmvFileName, rmvText, this.folderName);
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
