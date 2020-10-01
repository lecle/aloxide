import type { Api as EosApi } from 'eosjs';
import type IconService from 'icon-sdk-js';
import { BlockchainAccount } from './BlockchainAccount';
import { ContractPath, NetworkConfig } from './TypeDefinitions';

export abstract class BlockchainService {
  config: Readonly<NetworkConfig>

  /**
   * Blockchain Client which is used to work with Blockchain Services
   */
  client: EosApi | IconService

  constructor(networkConfig: NetworkConfig) {
    networkConfig.chainId = networkConfig.chainId.toString();

    this.config = networkConfig;
  }

  url() {
    const config = this.config;
    return `${config.protocol}://${config.host}${config.port ? ':' : ''}${config.port}`;
  }

  unique() {
    const config = this.config;
    return (`${config.type}:` + (config.chainId.length ? `chain:${config.chainId}` : `${config.host}:${config.port}`)).toLowerCase();
  }

  abstract async deployContract(contractPath: ContractPath, account: BlockchainAccount, opts?: any);

  abstract async getBalance(account: string, code?: string, symbol?: string);
}
