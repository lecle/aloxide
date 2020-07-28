import { ContractGenerator } from '@aloxide/abstraction';

import { ModelContractAdapter } from './adapter/ModelContractAdapter';
import { appConfig } from './appConfig';

export function generateModelConfig() {
  const modelGenerator = new ContractGenerator({
    ...appConfig,
    resultPath: appConfig.modelPath,
    adapter: new ModelContractAdapter(),
  });
  modelGenerator.generate();
}
