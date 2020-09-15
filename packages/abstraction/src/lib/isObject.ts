import { getType } from './Utils';

export function isObject(object): boolean {
  return getType(object) === 'object';
}
