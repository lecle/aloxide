import { Logger } from '@aloxide/logger';

import { EntityConfig } from './EntityConfig';

export interface ContractAdapter {
  entityConfigs: EntityConfig[];
  logger?: Logger;
  generate(outpuPath: string);
}
