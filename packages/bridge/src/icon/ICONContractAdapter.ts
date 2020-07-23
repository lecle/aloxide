import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from '../AbsContractAdapter';
import { FileCoder } from '../coder/FileCoder';
import { JsPrettier } from '../prettier/JsPrettier';
import { PythonPrettier } from '../prettier/PythonPrettier';

import type { Coder } from '../coder/Coder';
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

    this.templatePath = path.resolve(this.templatePath, 'icon');

    this.generateJson();
    this.generatePy();
    this.generatePackageJson();

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

    this.jsFileCoder.code(fileName, outText, this.folderName);
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

    this.pyFileCoder.code(fileName, outText, this.folderName);

    // copy __init__.py
    this.pyFileCoder.code(
      '__init__.py',
      fs.readFileSync(path.resolve(this.templatePath, this.folderName, '__init__.py'), 'utf-8'),
      this.folderName,
    );
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

  generatePackageJson() {
    const fileName = 'package.json';
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, this.folderName, `${fileName}.hbs`),
      'utf-8',
    );
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    this.jsFileCoder.code(fileName, outText, this.folderName);
  }
}
