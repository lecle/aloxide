import { NetworkConfig, BlockchainTypes } from '../blockchain-services';

const defaultCanTestnetConfig: NetworkConfig = {
  name: 'CAN Testnet',
  type: BlockchainTypes.EOS,
  chainId: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
  host: 'testnet.canfoundation.io',
  port: 443,
  protocol: 'https',
  coreToken: 'CAN'
}

export default defaultCanTestnetConfig;
