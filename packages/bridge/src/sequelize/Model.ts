import type { Field } from '../type-definition/Field';

export interface Model {
  name: string;
  attributes: Field[];
  primaryKey?: boolean;
}
