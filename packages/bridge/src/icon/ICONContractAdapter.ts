import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from '../AbsContractAdapter';
import { FileCoder } from '../coder/FileCoder';
import { JsPrettier } from '../prettier/JsPrettier';
import { PythonPrettier } from '../prettier/PythonPrettier';

import type { Coder } from '../coder/Coder';
import mapType from '../mapType';

export class ICONContractAdapter extends AbsContractAdapter {
  folderName: string = 'icon_hello';
  folderTestName: string = 'tests';
  pyFileCoder: Coder;
  jsFileCoder: Coder;

  constructor() {
    super('icon');
  }

  generateFromTemplate() {
    this.pyFileCoder = new FileCoder(this.outputPath, new PythonPrettier(), this.logger);
    this.jsFileCoder = new FileCoder(this.outputPath, new JsPrettier(), this.logger);

    //this.coder = new FileCoder(this.outputPath, new CplusplusPrettier(), this.logger);

    this.templatePath = path.resolve(this.templatePath, 'icon');
    this.logger.info(`---- this.templatePath: ${this.templatePath}`);

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
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);
    const outText = template({});
    this.jsFileCoder.code(fileName, outText, this.folderName);
  }

  generatePackage() {
    const fileName = 'package.json';
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    this.jsFileCoder.code(fileName, outText, this.folderName);
  }


  generateMainPy() {
    const fileName = 'icon_hello.py';
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);


    const outText = template({
      tables: this.entityConfigs ?.map(item => {
        return {
          name: item.name,
          fields: item.fields.map(({ name, type }) => ({
            name,
            type: mapType(type, this.blockchainType),
          })),
        };
      }),
    });
    this.jsFileCoder.code(fileName, outText, this.folderName);
  }

  generateCallAPI() {
    const fileName = 'call.json';
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    this.entityConfigs ?.map(item => {

      console.log(item);
      const actionName = "get" + item.name
      const outFileName = actionName + ".json";
      console.log(outFileName);
      const outText = template({
        action: actionName.toLocaleLowerCase()
      });
      this.jsFileCoder.code(outFileName, outText, this.folderName);

    });
  }

  generateTXAPI() {
    const fileName = 'tx.json';
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    this.entityConfigs ?.map(item => {
      // create data
      const crtActionName = "crt" + item.name
      const crtFileName = crtActionName + ".json";
      const crtText = template({
        action: crtActionName.toLocaleLowerCase(),
        fields: item.fields.map(({ name, type }) => ({
          name,
          type: mapType(type, this.blockchainType),
        })),
      });
      this.jsFileCoder.code(crtFileName, crtText, this.folderName);

      // update data
      const udtActionName = "upt" + item.name
      const uptFileName = udtActionName + ".json";
      const uptText = template({
        action: udtActionName.toLocaleLowerCase(),
        fields: item.fields.map(({ name, type }) => ({
          name,
          type: mapType(type, this.blockchainType),
        })),
      });
      this.jsFileCoder.code(uptFileName, uptText, this.folderName);

      // remove data
      const rmvActionName = "rmv" + item.name
      const rmvFileName = rmvActionName + ".json";
      const rmvText = template({
        action: rmvActionName.toLocaleLowerCase(),
        fields: [{"name": "id", "type": "int"}]
      });
      this.jsFileCoder.code(rmvFileName, rmvText, this.folderName);

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

    this.pyFileCoder.code(fileName, outText, path.join(this.folderName, this.folderTestName));

    // copy __init__.py
    this.pyFileCoder.code(
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

    this.pyFileCoder.code(fileName, outText, path.join(this.folderName, this.folderTestName));
  }
}
