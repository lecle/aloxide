import { FieldTypeEnum } from '@aloxide/bridge';

import type { EntityConfig } from '@aloxide/bridge';

export const indexStateSchema: EntityConfig = {
  name: 'IndexState',
  fields: [
    {
      name: 'blockNumber',
      type: FieldTypeEnum.uint64_t,
    },
    {
      name: 'blockHash',
      type: FieldTypeEnum.string,
    },
    {
      name: 'isReplay',
      type: FieldTypeEnum.uint64_t,
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
      type: FieldTypeEnum.uint64_t,
    },
    {
      name: 'lpBlockHash',
      type: FieldTypeEnum.string,
    },
    {
      name: 'lpBlockNumber',
      type: FieldTypeEnum.uint64_t,
    },
  ],
  key: 'handlerVersionName',
};
