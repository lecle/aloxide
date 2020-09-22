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
  outputPath: string;

  /**
   * Adapter of the blockchain
   */
  adapters?: ContractAdapter | ContractAdapter[];

  logger?: Logger;

  /**
   * name of the contract
   */
  contractName?: string;

  /**
   * With this option enabled, the generated smart-contract will not store any data to state-data
   * https://github.com/lecle/aloxide/issues/49
   *
   * Default is false
   */
  logDataOnly?: boolean;
}
