import { Field } from './Field';

export interface Action {
  actionName: string;
  params: Field[];
  code: string;
}
