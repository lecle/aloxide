import { EOSAction } from './EOSAction';

import type { Table } from '../type-definition/Table';
import type { Field } from '../type-definition/Field';

export class EOSDelAction extends EOSAction {
  constructor() {
    super('del');
  }
  implement(entity: Table): string {
    return this.template({
      tableName: entity.name,
      primaryField: entity.primaryField,
    });
  }
  makeParams(entity: Table): Field[] {
    return [
      {
        name: 'user',
        type: 'eosio::name',
      },
      entity.primaryField,
    ];
  }
}
