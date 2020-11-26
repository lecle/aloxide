import { QueryInput } from './QueryInput';

import type { DMeta } from './DMeta';
type modelName = string;

/**
 * ID is type of id in object to be manipulated
 * D is type of object to be manipulated
 *
 * Example: ID is string, and D is Poll type or Vote type
 */
export interface DataProvider<ID = any, D = any> {
  /**
   * name of the entity
   */
  name: modelName;

  /**
   * initializing stuffs can be put here
   */
  setup?(): Promise<void>;

  /**
   * count total items
   * @param name name of entity
   */
  count(): Promise<number>;

  /**
   * query items
   * @param name name of entity
   * @param queryInput input parameter
   */
  findAll(queryInput: QueryInput, meta: DMeta): Promise<D[]>;

  /**
   * find by id
   * @param id id of the object
   * @param meta metadata (to be updated)
   */
  find(id: ID, meta: DMeta): Promise<D>;

  /**
   * create or save object
   * @param data object data
   * @param meta metadata (to be updated)
   */
  create(data: D, meta: DMeta): Promise<D>;

  /**
   * update object
   * @param data object data
   * @param meta metadata (to be updated)
   */
  update(data: D, meta: DMeta): Promise<D>;

  /**
   * update object
   * @param data object data
   * @param meta metadata (to be updated)
   */
  delete(id: ID, meta: DMeta): Promise<boolean>;

  updateHistory(id: ID, meta: DMeta): Promise<D>;

  findBlockNumber(blockNumber: any): Promise<D>;

  updateOne(id, data): Promise<D>;

  deleteOne(id): Promise<D>;
}
