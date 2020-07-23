import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from './AbsContractAdapter';

export class ICONContractAdapter extends AbsContractAdapter {
  folderName: string = 'icon_hello';
  folderTesName: string = 'tests';

  constructor() {
    super('icon');
  }

  generateFromTemplate() {
    this.templatePath = path.resolve(this.templatePath, 'icon');

    // copy __init__.py
    this.ensureExistingFolder(path.resolve(this.outputPath, this.folderName));
    fs.copyFileSync(
      path.resolve(this.templatePath, this.folderName, '__init__.py'),
      path.resolve(this.outputPath, this.folderName, '__init__.py'),
    );

    this.generateJson();
    this.generatePy();
    this.generatePackageJson();

    // copy __init__.py
    this.ensureExistingFolder(path.resolve(this.outputPath, this.folderName, this.folderTesName));
    fs.copyFileSync(
      path.resolve(this.templatePath, this.folderName, this.folderTesName, '__init__.py'),
      path.resolve(this.outputPath, this.folderName, this.folderTesName, '__init__.py'),
    );
    this.generateUnitTestPy();
    this.generateIntegrateTestPy();
  }

  generateJson() {
    const fileName = 'hi_icon.json';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const outFile = path.resolve(this.outputPath, this.folderName, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }

  generatePy() {
    const fileName = 'icon_hello.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const outFile = path.resolve(this.outputPath, this.folderName, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }

  generateUnitTestPy() {
    const fileName = 'test_unit_icon_hello.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, this.folderTesName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const outFile = path.resolve(this.outputPath, this.folderName, this.folderTesName, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }

  generateIntegrateTestPy() {
    const fileName = 'test_integrate_icon_hello.py';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, this.folderTesName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const outFile = path.resolve(this.outputPath, this.folderName, this.folderTesName, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }

  generatePackageJson() {
    const fileName = 'package.json';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const outFile = path.resolve(this.outputPath, this.folderName, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }
}
