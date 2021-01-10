import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter } from '@aloxide/bridge';
import { createLogger } from 'bunyan';
import path from 'path';

const outputPath = path.resolve(__dirname, '../out');

const contractGenerator = new ContractGenerator({
  aloxideConfigPath: path.resolve(__dirname, '../samples/aloxide.yml'),
  outputPath,
  adapters: [
    new EOSContractAdapter() /* generate smart contract for EOS network */,
    new EOSContractAdapter({
      outputPath: path.resolve(outputPath, 'eos-no-state'),
      logDataOnly: true,
      keepVerification: true,
    }) /* generate smart contract for EOS network */,
    new ICONContractAdapter(),
  ],
  logger: createLogger({
    level: 'debug',
    name: 'g' /* generator */,
    src: false,
  }),
});

contractGenerator.generate();
