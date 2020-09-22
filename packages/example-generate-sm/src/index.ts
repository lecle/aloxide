import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter, ModelContractAdapter } from '@aloxide/bridge';
import { createLogger } from 'bunyan';
import path from 'path';

const outputPath = path.resolve(__dirname, '../out');

const contractGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  outputPath,
  adapters: [
    new EOSContractAdapter() /* generate smart contract for EOS network */,
    new EOSContractAdapter({
      logDataOnly: true,
      outputPath: path.resolve(outputPath, 'eos-no-state'),
    }) /* generate smart contract for EOS network */,
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
