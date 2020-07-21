import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from './AbsContractAdapter';

export class EOSContractAdapter extends AbsContractAdapter {
  constructor() {
    super('eos');
  }

  generateFromTemplate() {
    this.generateCpp();
    this.generateHpp();
  }

  generateCpp() {
    const cppHandlerbarsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, 'eos', 'hello.cpp.hbs'),
      'utf-8',
    );

    const template = Handlebars.compile(cppHandlerbarsTemplate);

    // translate
    const outText = template({});

    const fileName = 'hello.cpp';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }

  generateHpp() {
    const cppHandlerbarsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, 'eos', 'hello.hpp.hbs'),
      'utf-8',
    );

    const template = Handlebars.compile(cppHandlerbarsTemplate);

    // translate
    const outText = template({});

    const fileName = 'hello.hpp';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }
}
