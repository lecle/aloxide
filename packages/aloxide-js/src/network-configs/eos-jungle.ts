import { NetworkConfig, BlockchainTypes } from '../blockchain-services';

const defaultJungleConfig: NetworkConfig = {
  name: 'jungle',
  type: BlockchainTypes.EOS,
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  host: 'jungle2.cryptolions.io',
  port: 443,
  protocol: 'https',
  coreToken: 'EOS'
}

export default defaultJungleConfig;
