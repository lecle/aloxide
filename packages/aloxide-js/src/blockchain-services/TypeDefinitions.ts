export type NetworkConfig = {
  name: string;
  type: BlockchainTypes;
  protocol: string;
  host: string;
  port: number;
  chainId: string;
  coreToken: string;
};

export enum BlockchainTypes {
  EOS = 'eos',
  ICON = 'icon',
};

export type ContractPath = {
  wasmPath?: string,
  abiPath?: string,
  pyPath?: string,
};
