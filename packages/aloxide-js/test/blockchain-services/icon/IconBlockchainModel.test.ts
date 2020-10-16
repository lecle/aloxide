import { IconBlockchainService } from '../../../src/blockchain-services/icon';
import { BlockchainAccount, iconTestnetConfig } from '../../../src';

describe('test IconBlockchainModel', () => {
  describe('add()', () => {
    // This is a real test which add new data to blockchain
    xit('should add new item to blockchain', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.model(
        'Poll',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
      );

      const res = await Poll.add({ id: '1', name: 'Poll 1', body: 'Poll 1 test!' });
      expect(typeof res).toBe('string');
    }, 30000);
  });

  describe('get()', () => {
    // This is a real test which get data on blockchain
    xit('should get item info from blockchain', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.model(
        'Poll',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
      );

      const res = await Poll.get('1');
      expect(res).toEqual({ id: '1', name: 'Poll 1', body: 'Poll 1 test!' });
    }, 30000);
  });

  describe('update()', () => {
    // This is a real test which modify data on blockchain
    xit('should update item', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.model(
        'Poll',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
      );

      const res = await Poll.update('1', { name: 'Updated Poll 1', body: 'Updated Poll 1 test' });
      expect(typeof res).toBe('string');
    }, 30000);
  });

  describe('delete()', () => {
    // This is a real test which remove data on blockchain
    xit('should delete item from blockchain', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.model(
        'Poll',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
      );

      const res = await Poll.delete('1');
      expect(typeof res).toBe('string');
    }, 30000);
  });
});
