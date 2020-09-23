import BaseNetwork  from '../base-blockchain/base-network';

const JungleNetworkConfig = {
    name: 'jungle',
    blockchain:'eos',
    chainId:'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
    host:'jungle2.cryptolions.io',
    port:443,
    protocol:'https',
    coreToken: 'EOS'
}
    
export default class EOSJungle extends BaseNetwork {
    constructor(networkConfig = {}) {
        super(Object.assign({}, JungleNetworkConfig, networkConfig))
    }
}