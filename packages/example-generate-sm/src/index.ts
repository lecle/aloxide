import { ContractGenerator } from '@aloxide/abstraction';

import { EOSContractAdapter, ICONContractAdapter, MultipleContractAdapter } from '@aloxide/bridge';
import { createLogger } from '@aloxide/logger';
import path from 'path';

const adapter = new MultipleContractAdapter();
adapter.addAdapters(new EOSContractAdapter(), new ICONContractAdapter());

const contractEOSGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  resultPath: path.resolve(__dirname, '../out'),
  adapter,
  logger: createLogger({
    consoleLogger: true,
  }),
});

contractEOSGenerator.generate();

// const adapterICON = new ICONContractAdapter();
// const contractICONGenerator = new ContractGenerator({
//   aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
//   resultPath: path.resolve(__dirname, '../out'),
//   adapter: adapterICON,
//   logger: createLogger({
//     consoleLogger: true,
//   }),
// });

// contractICONGenerator.generate();