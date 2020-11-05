import { EOSAction } from './EOSAction';

import type { Table } from '../type-definition/Table';
import type { Field } from '../type-definition/Field';

export class EOSUpdAction extends EOSAction {
  constructor() {
    super('upd');
  }
  implement(entity: Table): string {
    return this.template({
      _config: {
        useStateData: !(this.logDataOnly === true && this.keepVerification !== true),
      },
      tableName: entity.name,
      primaryKeyField: entity.primaryKeyField,
      fields: entity.fields,
    });
  }
  makeParams(entity: Table): Field[] {
    return [
      {
        name: 'user',
        type: 'eosio::name',
      },
      ...entity.fields,
    ];
  }
}
