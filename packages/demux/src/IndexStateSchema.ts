import { FieldTypeEnum } from '@aloxide/bridge';

import type { EntityConfig } from '@aloxide/bridge';

export const indexStateSchema: EntityConfig = {
  name: 'IndexState',
  fields: [
    {
      name: 'blockNumber',
      type: FieldTypeEnum.number,
    },
    {
      name: 'blockHash',
      type: FieldTypeEnum.string,
    },
    {
      name: 'isReplay',
      type: FieldTypeEnum.number,
    },
    {
      name: 'handlerVersionName',
      type: FieldTypeEnum.string,
    },
  ],
  key: 'handlerVersionName',
};
