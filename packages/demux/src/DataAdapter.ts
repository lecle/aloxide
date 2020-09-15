type modelName = string;

export type DMeta = any;

/**
 * ID is type of id in object to be manipulated
 * D is type of object to be manipulated
 *
 * Example: ID is string, and D is Poll type or Vote type
 */
export interface DataAdapter<ID, D> {
  /**
   * initializing stuffs can be put here
   */
  setup?(): Promise<void>;

  /**
   * find by id
   * @param name name of entity
   * @param id id of the object
   * @param meta metadata (to be updated)
   */
  find(name: modelName, id: ID, meta?: DMeta): Promise<D>;

  /**
   * create or save object
   * @param name name of entity
   * @param data object data
   * @param meta metadata (to be updated)
   */
  create(name: modelName, data: D, meta?: DMeta): Promise<D>;

  /**
   * update object
   * @param name name of entity
   * @param data object data
   * @param meta metadata (to be updated)
   */
  update(name: modelName, data: D, meta?: DMeta): Promise<D>;

  /**
   * update object
   * @param name name of entity
   * @param data object data
   * @param meta metadata (to be updated)
   */
  delete(name: modelName, id: ID, meta?: DMeta): Promise<boolean>;
}
