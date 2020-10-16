import { NetworkConfig, BlockchainTypes } from '../blockchain-services';

export const iconTestnetConfig: NetworkConfig = {
  name: 'ICON Testnet',
  type: BlockchainTypes.ICON,
  chainId: '',
  host: 'bicon.net.solidwallet.io',
  path: '/api/v3',
  port: 443,
  protocol: 'https',
  coreToken: 'ICX',
};
