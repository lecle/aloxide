import type { Field } from '@aloxide/bridge';

export interface Model {
  name: string;
  attributes: Field[];
  primaryKey?: boolean;
}
