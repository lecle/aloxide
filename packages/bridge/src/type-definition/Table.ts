import { Field } from './Field';

export interface Table {
  name: string;
  fields: Field[];
  primaryKeyField: Field;
}
