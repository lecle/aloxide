import { Action } from './type-definition/Action';
import { Table } from './type-definition/Table';

/**
 * Define interface for creating actions.
 * Current suppported actions are:
 * - Create an entity instance
 * - Update an entity instance
 * - Delete an entity instance
 */
export interface ActionCreator {
  actionPrefix: string;
  templatePath: string;
  create(entity: Table): Action;
}
