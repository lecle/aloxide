import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from './AbsContractAdapter';

export class EOSContractAdapter extends AbsContractAdapter {
  constructor() {
    super('eos');
  }

  generateFromTemplate() {
    this.templatePath = path.resolve(this.templatePath, 'eos');

    this.generateCpp();
    this.generateHpp();
  }

  generateCpp() {
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, 'hello.cpp.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const fileName = 'hello.cpp';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }

  generateHpp() {
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, 'hello.hpp.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const fileName = 'hello.hpp';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }
}
