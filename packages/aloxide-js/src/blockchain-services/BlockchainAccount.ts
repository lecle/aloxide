export class BlockchainAccount {
  name: string;
  privateKey: string;

  constructor(name: string, privateKey?: string) {
    if (!name) {
      throw new Error('Private key is required');
    }

    this.name = name;
    this.privateKey = privateKey;

    if (!privateKey) {
      this.privateKey = name;
    }
  }
}
