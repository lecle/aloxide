import { EntityConfig, FieldTypeEnum } from '@aloxide/bridge/src';

export class IndexStateSchema implements EntityConfig {
  name: 'IndexState';
  fields: [
    {
      name: 'id';
      type: FieldTypeEnum.number;
    },
    {
      name: 'blockNumber';
      type: FieldTypeEnum.number;
    },
    {
      name: 'blockHash';
      type: FieldTypeEnum.string;
    },
    {
      name: 'isReplay';
      type: FieldTypeEnum.number;
    },
    {
      name: 'handlerVersionName';
      type: FieldTypeEnum.string;
    },
  ];
  key: 'id';
}
