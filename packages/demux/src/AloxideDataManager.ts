import type { DataAdapter } from './DataAdapter';
import type { DataProvider } from './DataProvider';
import type { QueryInput } from './QueryInput';
import type { DMeta } from './DMeta';

export interface AloxideDataManagerOptions {
  dataProviderMap: Map<string, DataProvider>;
}

export class AloxideDataManager implements DataAdapter {
  dataProviderMap: Map<string, DataProvider<any, any>>;

  /**
   * dataProviderMap is required
   * It contains data provider for some entities
   * Those missing entities will be notify via error at initializing time
   * @param options
   */
  constructor(options: AloxideDataManagerOptions) {
    this.dataProviderMap = options.dataProviderMap;

    if (!this.dataProviderMap) {
      throw new Error('Missing data provider map!');
    }
  }

  /**
   * throw error if there is missing of entity name
   * @param entityNames entity names
   */
  verify(entityNames: string[]) {
    const missingNames = entityNames.filter(entityName => !this.dataProviderMap.has(entityName));
    if (missingNames && missingNames.length > 0) {
      throw new Error(`Missing data provider name: ${missingNames.join(', ')}`);
    }
  }

  setup?(name: string): Promise<void> {
    const p = this.getDataProvider(name);

    if (typeof p.setup == 'function') {
      return p.setup();
    }
    return Promise.resolve();
  }

  count(name: string): Promise<number> {
    return this.getDataProvider(name).count();
  }

  findAll(name: string, queryInput: QueryInput, meta: DMeta): Promise<any[]> {
    return this.getDataProvider(name).findAll(queryInput, meta);
  }

  find(name: string, id: any, meta?: any): Promise<any> {
    return this.getDataProvider(name).find(id, meta);
  }

  create(name: string, data: any, meta?: any): Promise<any> {
    return this.getDataProvider(name).create(data, meta);
  }

  update(name: string, data: any, meta?: any): Promise<any> {
    return this.getDataProvider(name).update(data, meta);
  }

  delete(name: string, id: any, meta?: any): Promise<boolean> {
    return this.getDataProvider(name).delete(id, meta);
  }

  /**
   *
   * @param name entity name
   */
  getDataProvider(name: string): DataProvider<any, any> {
    const d = this.dataProviderMap.get(name);
    if (!d) {
      throw new Error('Missing data provider name: ' + name);
    }

    return d;
  }
}
