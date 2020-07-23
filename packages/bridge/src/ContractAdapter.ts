import { Logger } from '@aloxide/logger';

import { EntityConfig } from './type-definition/EntityConfig';

export interface ContractAdapter {
  contractName: string;
  entityConfigs: EntityConfig[];
  logger?: Logger;
  generate(outpuPath: string);
}
