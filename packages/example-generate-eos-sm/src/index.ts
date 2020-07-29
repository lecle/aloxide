import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter } from '@aloxide/bridge';
import { createLogger } from '@aloxide/logger';
import path from 'path';

const adapterEOS = new EOSContractAdapter();

const contractEOSGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  resultPath: path.resolve(__dirname, '../out'),
  adapter: adapterEOS,
  logger: createLogger({
    consoleLogger: true,
  }),
});

contractEOSGenerator.generate();

const adapterICON = new ICONContractAdapter();
const contractICONGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  resultPath: path.resolve(__dirname, '../out'),
  adapter: adapterICON,
  logger: createLogger({
    consoleLogger: true,
  }),
});

contractICONGenerator.generate();