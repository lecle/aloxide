import BaseNetwork  from '../base-blockchain/base-network';
const CANTestnetNetworkConfig = {
    name: 'CAN Testnet',
    blockchain:'eos',
    chainId:'353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
    host:'testnet.canfoundation.io',
    port:443,
    protocol:'https',
    coreToken: 'CAN'
}

export default class CANTestnet extends BaseNetwork {
    constructor(networkConfig={}) {
        super(Object.assign({}, CANTestnetNetworkConfig, networkConfig))
    }
}