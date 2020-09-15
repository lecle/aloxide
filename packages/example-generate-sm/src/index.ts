import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter, ModelContractAdapter } from '@aloxide/bridge';
import { createLogger } from 'bunyan';
import path from 'path';

const contractGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  resultPath: path.resolve(__dirname, '../out'),
  adapters: [
    new EOSContractAdapter(),
    new ICONContractAdapter(),
    new ModelContractAdapter(),
  ],
  logger: createLogger({
    level: 'debug',
    name: 'g' /* generator */,
    src: false,
  }),
});

contractGenerator.generate();
