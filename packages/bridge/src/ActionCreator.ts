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

  /**
   * With this option enabled, the generated smart-contract will not store any data to state-data
   * https://github.com/lecle/aloxide/issues/49
   *
   * Default is false
   */
  logDataOnly?: boolean;
  keepVerification?: boolean;

  create(entity: Table): Action;
}
