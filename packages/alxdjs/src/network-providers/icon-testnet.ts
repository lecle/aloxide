import BaseNetwork from '../base-blockchain/base-network';

const ICONTestnetConfig = {
  name: 'ICON Testnet',
  blockchain: 'icon',
  chainId: '',
  host: 'bicon.net.solidwallet.io/api/v3',
  port: 80,
  protocol: 'https',
  coreToken: 'ICX',
};

export default class ICONTestnet extends BaseNetwork {
  constructor(networkConfig = {}) {
    super(Object.assign({}, ICONTestnetConfig, networkConfig));
  }
}
