import { Field } from './Field';

export interface EntityConfig {
  name: string;
  fields: Field[];
  key: string;
}
