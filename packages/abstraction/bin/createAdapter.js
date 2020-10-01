const { EOSContractAdapter, ICONContractAdapter } = require('@aloxide/bridge');
const { logger } = require('./createLogger');

function createAdapter(adapterNames) {
  return adapterNames
    .replace(/\s+/g, '')
    .split(',')
    .map(a => {
      let adapter;
      switch (a) {
        case 'eos':
        case 'can':
          logger.debug('use adapter', a);
          adapter = new EOSContractAdapter();
          break;
        case 'icon':
          logger.debug('use adapter', a);
          adapter = new ICONContractAdapter();
          break;
        default:
          throw new Error(`unknown adapter ${a}`);
      }

      return adapter;
    });
}

module.exports = { createAdapter };
