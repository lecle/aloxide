import { validateNetworkConfig } from '../../src/helpers/validate-network-config';

describe('test validate-network-config', () => {
  describe('test validateNetworkConfig()', () => {
    it('should throw error when missing config', () => {
      expect(() => {
        validateNetworkConfig(undefined);
      }).toThrowError('Missing network config!');
    });

    it('should throw error when missing any required keys', () => {
      expect(() => {
        validateNetworkConfig({});
      }).toThrowError(
        'Missing required configs: "name", "type", "protocol", "host", "port", "chainId", "coreToken"',
      );

      expect(() => {
        validateNetworkConfig({
          name: 'test',
          host: 'test',
          port: 0,
          chainId: 'test',
        });
      }).toThrowError('Missing required configs: "type", "protocol", "coreToken"');
    });
  });
});
