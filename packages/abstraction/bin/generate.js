const path = require('path');
const { ContractGenerator } = require('../dist');
const { createLogger } = require('./createLogger');

function generate(aloxideConfigPath, options) {
  const logger = createLogger({
    level: options.verbose ? 'debug' : 'info',
  });

  const config = {
    aloxideConfigPath: path.resolve(process.cwd(), aloxideConfigPath),
    outputPath: path.resolve(process.cwd(), options.outputPath),
    adapters: options.adapters,
    logger,
    contractName: options.contractName,
    logDataOnly: options.logDataOnly,
  };

  const g = new ContractGenerator(config);
  g.generate();

  logger.info(`generate smart contract success fully`);
  logger.info(`output folder:`, config.outputPath);

  if (options.printConfig) {
    logger.info(JSON.stringify(g.aloxideConfig, null, options.printConfig == 'pretty' && 2));
  }
}

module.exports = { generate };
