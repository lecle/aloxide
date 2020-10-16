import type { Api as EosApi } from 'eosjs';
import type IconService from 'icon-sdk-js';
import { BlockchainAccount } from './BlockchainAccount';
import { BlockchainModel } from './BlockchainModel';
import { ContractPath, NetworkConfig } from './TypeDefinitions';
import { removeTrailingSlash } from '../helpers/remove-trailing-slash';

export abstract class BlockchainService {
  config: Readonly<NetworkConfig>;

  /**
   * Blockchain Client which is used to work with Blockchain Services
   */
  client: EosApi | IconService;

  constructor(networkConfig: NetworkConfig) {
    networkConfig.chainId = networkConfig.chainId.toString();
    networkConfig.host = removeTrailingSlash(networkConfig.host);
    networkConfig.path = removeTrailingSlash(networkConfig.path);

    this.config = networkConfig;
  }

  url() {
    const config = this.config;
    return `${config.protocol}://${config.host}${config.port ? ':' : ''}${config.port}${
      config.path ? '/' + config.path : ''
    }`;
  }

  unique() {
    const config = this.config;
    return (
      `${config.type}:` +
      (config.chainId.length ? `chain:${config.chainId}` : `${config.host}:${config.port}`)
    ).toLowerCase();
  }

  abstract async deployContract(contractPath: ContractPath, account: BlockchainAccount, opts?: any);

  abstract async getBalance(account: string, code?: string, symbol?: string);

  abstract async createModel(
    entityName: string,
    contract: string,
    account?: BlockchainAccount,
  ): Promise<BlockchainModel>;
}
