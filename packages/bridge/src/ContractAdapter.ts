import type { Logger } from './Logger';
import type { EntityConfig } from './type-definition/EntityConfig';

export interface ContractAdapter {
  contractName: string;
  entityConfigs: EntityConfig[];
  logger?: Logger;

  /**
   * With this option enabled, the generated smart-contract will not store any data to state-data
   * https://github.com/lecle/aloxide/issues/49
   *
   * Default is false
   */
  logDataOnly?: boolean;

  generate(outpuPath: string);
}
