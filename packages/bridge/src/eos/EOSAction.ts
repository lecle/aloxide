import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { ActionCreator } from '../ActionCreator';

import type { Action } from '../type-definition/Action';
import type { Field } from '../type-definition/Field';
import type { Table } from '../type-definition/Table';

export abstract class EOSAction implements ActionCreator {
  actionPrefix: string;
  templatePath: string;
  logDataOnly?: boolean;
  keepVerification?: boolean;

  template: HandlebarsTemplateDelegate<any>;

  constructor(actionPrefix: string) {
    this.actionPrefix = actionPrefix;
  }

  create(entity: Table): Action {
    const actionName = this.makeActionName(entity.name);
    const code = this.templateImplement(entity);
    const params = this.makeParams(entity);

    return {
      actionName,
      code,
      params,
    };
  }

  protected templateImplement(entity: Table): string {
    const hbsTemplate = fs.readFileSync(
      path.resolve(this.templatePath, `${this.actionPrefix}.cpp.hbs`),
      'utf-8',
    );

    this.template = Handlebars.compile(hbsTemplate, {
      noEscape: true,
    });

    const modifiedEntity = { ...entity };
    // Only store primary key as state data when `keepVerification` is true.
    if (this.logDataOnly === true && this.keepVerification === true) {
      modifiedEntity.fields = [modifiedEntity.primaryKeyField];
    }

    return this.implement(modifiedEntity);
  }

  /**
   * return implementation of the action
   */
  abstract implement(entity: Table): string;

  /**
   * make action parameter
   */
  abstract makeParams(entity: Table): Field[];

  /**
   * @param name name of the action; maybe a Entity Name
   */
  makeActionName(name: string): string {
    return `${this.actionPrefix}${name.substr(0, 9).toLowerCase()}`;
  }
}
