import { BlockchainAccount } from '../../src';

describe('test BlockchainAccount', () => {
  describe('test BlockchainAccount creation', () => {
    it('should throw error when missing parameter', () => {
      expect(() => {
        // @ts-ignore
        const account = new BlockchainAccount();
      }).toThrowError('Private key is required');
    });
    it('should create Blockchain Account with name and private key are the same when passing 1 parameter', () => {
      const account = new BlockchainAccount('private_key');
      expect(account.name).toBe(account.privateKey);
    });

    it('should create Blockchain Account with name and private key are different when passing 2 parameters', () => {
      const account = new BlockchainAccount('name', 'private_key');
      expect(account.name).toBe('name');
      expect(account.privateKey).toBe('private_key');
    });
  });
});
