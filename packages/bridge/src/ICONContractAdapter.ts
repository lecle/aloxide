import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { AbsContractAdapter } from './AbsContractAdapter';
import mapPrimaryKeyType from './mapPrimaryKeyType';
import mapICONType from './mapICONType';

export class ICONContractAdapter extends AbsContractAdapter {
  constructor() {
    super('icon');
  }

  generateFromTemplate() {
    this.templatePath = path.resolve(this.templatePath, 'icon');
    this.logger.info(`---- generating icon file:`);
    this.generateInit();
    this.generatePackage();
    this.generateMainModule();
    // Todo: this.generateCallAPI();
  }
  generateInit() {
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, '__init__.py.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const fileName = '__init__.py';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }
  generatePackage(){
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, 'package.json.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    // translate
    const outText = template({});

    const fileName = 'package.json';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);    
  }


  generateMainModule() {
    const hbsTemplate = fs.readFileSync(path.resolve(this.templatePath, 'icon_hello.py.hbs'), 'utf-8');
    const template = Handlebars.compile(hbsTemplate);

    const outText = template({
      tables: this.entityConfigs?.map(item => {
        return {
          name: item.name,
          fields: item.fields.map(({ name, type }) => ({
            name,
            type: mapICONType(type),
          })),
          primaryKeyType: mapPrimaryKeyType(item.fields, item.key),
          primaryKeyName: item.key,
        };
      }),
    });

    const fileName = 'icon_hello.py';
    const outFile = path.resolve(this.outputPath, fileName);
    fs.writeFileSync(outFile, outText);
    this.logger.info(`---- success generating file: ${outFile}`);
  }
}

