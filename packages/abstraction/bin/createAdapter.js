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
          adapter = new EOSContractAdapter();
          break;
        case 'can':
          adapter = new EOSContractAdapter({
            outputPath: a,
          });
          break;
        case 'icon':
          adapter = new ICONContractAdapter();
          break;
        default:
          throw new Error(`unknown adapter ${a}`);
      }

      return adapter;
    });
}

module.exports = { createAdapter };
