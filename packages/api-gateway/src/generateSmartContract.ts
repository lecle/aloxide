import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter, MultipleContractAdapter } from '@aloxide/bridge';

import { appConfig } from './appConfig';

export function generateSmartContract() {
  const adapter = new MultipleContractAdapter();

  if (appConfig.eosEnable) {
    adapter.addAdapters(new EOSContractAdapter());
  }

  if (appConfig.iconEnable) {
    adapter.addAdapters(new ICONContractAdapter());
  }

  const contractGenerator = new ContractGenerator({ ...appConfig, adapter });
  contractGenerator.generate();
}
