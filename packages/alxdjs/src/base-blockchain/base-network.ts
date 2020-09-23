export type BaseNetworkConfig = {
  name: string,
  blockchain: string,
  protocol: string,
  host: string,
  port: number,
  chainId: string,
  coreToken: string,
};

export default class BaseNetwork {
  name: string;
  blockchain: string;
  protocol: string;
  host: string;
  port: number;
  chainId: string;
  coreToken: string;
  constructor(networkConfig: BaseNetworkConfig) {
    this.name = networkConfig.name;
    this.blockchain = networkConfig.blockchain;
    this.protocol = networkConfig.protocol;
    this.host = networkConfig.host;
    this.port = networkConfig.port;
    this.chainId = networkConfig.chainId.toString();
    this.coreToken = networkConfig.coreToken;
  }

  url() {
    return `${this.protocol}://${this.host}${this.port ? ':' : ''}${this.port}`;
  }

  unique() {
    return (`${this.blockchain}:` + (this.chainId.length ? `chain:${this.chainId}` : `${this.host}:${this.port}`)).toLowerCase();
  }
}