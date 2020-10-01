import { Aloxide, canTestnetConfig, iconTestnetConfig } from '../src';

describe('test Aloxide', () => {
  describe('createService()', () => {
    it.todo('should throw error if input network config is invalid');
    it.todo('should should throw error if blockchain type is unsupported');

    it.todo('should throw error if needed dependency is not installed', async () => {
      await expect(Aloxide.createService(canTestnetConfig)).rejects.toThrowError('Missing dependency: Please install missing module \'eosjs\' in order to create relative service!');

      await expect(Aloxide.createService(iconTestnetConfig)).rejects.toThrowError('Missing dependency: Please install missing module \'icon-sdk-js\' in order to create relative service!');
    });
  })
});
