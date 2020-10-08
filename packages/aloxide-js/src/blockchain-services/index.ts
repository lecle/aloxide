import { validateNetworkConfig } from '../helpers/validate-network-config';
import { BlockchainAccount } from './BlockchainAccount';
import { BlockchainService } from './BlockchainService';
import { NetworkConfig, BlockchainTypes, ContractPath } from './TypeDefinitions';

export class Aloxide {
  static async createService(networkConfig: NetworkConfig): Promise<BlockchainService> {
    // Validate config
    validateNetworkConfig(networkConfig);

    try {
      switch (networkConfig.type) {
        case BlockchainTypes.EOS:
          const { EosBlockchainService } = await import('./eos');
          return new EosBlockchainService(networkConfig);

        case BlockchainTypes.ICON:
          const { IconBlockchainService } = await import('./icon');
          return new IconBlockchainService(networkConfig);

        default:
          throw new Error('No supported blockchain');
      }
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        throw new Error(
          `Missing dependency: Please install missing module '${e.moduleName}' in order to create relative service!`,
        );
      }

      throw e;
    }
  }
}

export { NetworkConfig, BlockchainTypes, BlockchainService, ContractPath, BlockchainAccount };
