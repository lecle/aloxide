import BaseNetwork  from '../base-blockchain/base-network';
const CANMainnetNetworkConfig = {
    name: 'CAN Mainnet',
    blockchain:'eos',
    chainId:'3374d357e62f8b6ac7a000d0139fa81844be6265253a14a7e55243e4080d3b72',
    host:'api.canfoundation.io',
    port:443,
    protocol:'https',
    coreToken: 'CAN'
}

export default class CANTestnet extends BaseNetwork {
    constructor(networkConfig={}) {
        super(Object.assign({}, CANMainnetNetworkConfig, networkConfig))
    }
}