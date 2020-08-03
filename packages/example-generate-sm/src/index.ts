import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter, MultipleContractAdapter } from '@aloxide/bridge';
import { createLogger } from '@aloxide/logger';
import path from 'path';

const adapter = new MultipleContractAdapter();

adapter.addAdapters(new EOSContractAdapter(), new ICONContractAdapter());

const contractGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  resultPath: path.resolve(__dirname, '../out'),
  adapter,
  logger: createLogger({
    consoleLogger: true,
  }),
});

contractGenerator.generate();
