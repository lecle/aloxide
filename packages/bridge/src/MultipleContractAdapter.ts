import { Logger } from '@aloxide/logger/src';

import { ContractAdapter } from './ContractAdapter';

import type { EntityConfig } from './type-definition/EntityConfig';

export class MultipleContractAdapter implements ContractAdapter {
  contractName: string;
  entityConfigs: EntityConfig[];
  logger?: Logger;
  private adapters: ContractAdapter[] = [];

  generate(outpuPath: string) {
    this.adapters.forEach(adapter => {
      Object.keys(this)
        .filter(k => typeof this[k] != 'function' && k != 'adapters')
        .forEach(k => {
          adapter[k] = this[k];
        });
      adapter.generate(outpuPath);
    });
  }

  addAdapters(...adapters: ContractAdapter[]) {
    this.adapters.push(...adapters);
  }
}
