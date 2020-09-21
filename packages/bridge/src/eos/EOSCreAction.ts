import { EOSAction } from './EOSAction';

import type { Table } from '../type-definition/Table';
import type { Field } from '../type-definition/Field';

export class EOSCreAction extends EOSAction {
  constructor() {
    super('cre');
  }

  implement(entity: Table): string {
    return this.template({
      _config: {
        logDataOnly: this.logDataOnly,
      },
      tableName: entity.name,
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
