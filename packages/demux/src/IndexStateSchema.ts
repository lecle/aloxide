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
    {
      name: 'state',
      type: FieldTypeEnum.string,
    },
    {
      name: 'liBlockNumber',
      type: FieldTypeEnum.number,
    },
    {
      name: 'lpBlockHash',
      type: FieldTypeEnum.string,
    },
    {
      name: 'lpBlockNumber',
      type: FieldTypeEnum.number,
    },
  ],
  key: 'handlerVersionName',
};
