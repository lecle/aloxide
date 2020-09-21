import {Blockchains} from './Blockchains';

export default class BaseNetwork {
    name: String;
    blockchain: String;
    protocol: String;
    host: String;
    port: Number;
    chainId: String;
    coreToken: String;
    constructor(networkConfig: any){
        this.name = networkConfig.name;
        this.blockchain = networkConfig.blockchain;
        this.protocol = networkConfig.protocol;
        this.host = networkConfig.host;
        this.port = networkConfig.port;
        this.chainId = networkConfig.chainId.toString();
        this.coreToken = networkConfig.coreToken;
    }

    url(){ return `${this.protocol}://${this.host}${this.port ? ':' : ''}${this.port}` }
	unique(){ return (`${this.blockchain}:` + (this.chainId.length ? `chain:${this.chainId}` : `${this.host}:${this.port}`)).toLowerCase(); }
}