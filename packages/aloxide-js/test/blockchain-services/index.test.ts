import { Aloxide, canTestnetConfig, iconTestnetConfig, NetworkConfig } from '../../src';

describe('test Aloxide', () => {
  describe('createService()', () => {
    it('should throw error if input network config is invalid', async () => {
      await expect(Aloxide.createService(undefined)).rejects.toThrowError(
        'Missing network config!',
      );

      const invalidConfig: NetworkConfig = {
        // @ts-ignore
        invalidField: 'test',
      };

      await expect(Aloxide.createService(invalidConfig)).rejects.toThrowError(
        'Missing required configs: "name", "type", "protocol", "host", "chainId", "coreToken"',
      );
    });

    it('should should throw error if blockchain type is unsupported', async () => {
      const config: NetworkConfig = {
        name: 'ICON Testnet',
        // @ts-ignore
        type: 'test',
        chainId: '',
        host: 'bicon.net.solidwallet.io/api/v3',
        port: 443,
        protocol: 'https',
        coreToken: 'ICX',
      };

      await expect(Aloxide.createService(config)).rejects.toThrowError('No supported blockchain');
    });

    it('should create EOS blockchain type', async () => {
      expect(Aloxide.createService(canTestnetConfig)).toBeDefined();
    });

    it('should create ICON blockchain type', async () => {
      expect(Aloxide.createService(iconTestnetConfig)).toBeDefined();
    });

    xit('should throw error if needed dependency is not installed', async () => {
      await expect(Aloxide.createService(canTestnetConfig)).rejects.toThrowError(
        "Missing dependency: Please install missing module 'eosjs' in order to create relative service!",
      );

      await expect(Aloxide.createService(iconTestnetConfig)).rejects.toThrowError(
        "Missing dependency: Please install missing module 'icon-sdk-js' in order to create relative service!",
      );
    });
  });
});
