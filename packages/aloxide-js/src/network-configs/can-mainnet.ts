import { NetworkConfig, BlockchainTypes } from '../blockchain-services';

const defaultCanMainnetConfig: NetworkConfig = {
  name: 'CAN Mainnet',
  type: BlockchainTypes.EOS,
  chainId: '3374d357e62f8b6ac7a000d0139fa81844be6265253a14a7e55243e4080d3b72',
  host: 'api.canfoundation.io',
  port: 443,
  protocol: 'https',
  coreToken: 'CAN'
}

export default defaultCanMainnetConfig;
