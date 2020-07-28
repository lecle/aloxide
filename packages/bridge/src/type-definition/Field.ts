import { FieldTypeEnum } from './FieldTypeEnum';

export interface Field {
  type: string | FieldTypeEnum;
  name: string;
}
