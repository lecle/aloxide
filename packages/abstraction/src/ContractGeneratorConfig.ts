import type { ContractAdapter } from '@aloxide/bridge';
import type { Logger } from './Logger';

export interface ContractGeneratorConfig {
  /**
   * aloxide.(yml|json) path
   */
  aloxideConfigPath: string;

  /**
   * output path in where you want to put generated files
   */
  resultPath: string;

  /**
   * Adapter of the blockchain
   */
  adapters?: ContractAdapter | ContractAdapter[];

  logger?: Logger;

  /**
   * name of the contract
   */
  contractName?: string;
}
