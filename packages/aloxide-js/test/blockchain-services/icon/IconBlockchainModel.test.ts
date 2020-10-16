import { IconBlockchainModel, IconBlockchainService } from '../../../src/blockchain-services/icon';
import { BlockchainAccount, iconTestnetConfig } from '../../../src';
import { Call, IconBuilder } from 'icon-sdk-js';

describe('test IconBlockchainModel', () => {
  const testActions = [
    {
      name: 'getpoll',
      inputs: [{ name: 'id', type: 'string' }],
    },
    {
      name: 'crepoll',
      inputs: [{ name: 'testparamcreate', type: 'string' }],
    },
    {
      name: 'updpoll',
      inputs: [
        { name: 'id', type: 'string' },
        { name: 'user', type: 'string' },
        { name: 'testparamupdate', type: 'string' },
      ],
    },
    {
      name: 'delpoll',
      inputs: [{ name: 'id', type: 'string' }],
    },
  ];
  const testUrl = 'https://testnet.example.io:443';
  const testKey = 'fedeb1d06b6b45d1d424f02fbeee400626c8de69b9b0e863aa864c773981daa2';

  describe('_sendCallTransaction()', () => {
    it('should send Call transaction', async () => {
      const Poll = new IconBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      // @ts-ignore
      const getMaxLimitMock = jest.spyOn(Poll, '_getMaxLimit').mockResolvedValueOnce('123');
      // @ts-ignore
      const httpCallMock = jest.spyOn(Poll.client, 'sendTransaction').mockReturnValueOnce({
        execute: async () => {
          return ('test_trx_id' as unknown) as Call;
        },
      });

      const res = await Poll._sendCallTransaction('test_method', { id: 'test' });
      expect(res).toBe('test_trx_id');
      expect(getMaxLimitMock).toBeCalledTimes(1);
      expect(httpCallMock).toBeCalledTimes(1);
    });
  });

  describe('_getMaxLimit()', () => {
    it('should get max limit value available', async () => {
      const Poll = new IconBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      // @ts-ignore
      const httpCallMock = jest.spyOn(Poll.client, 'getScoreApi').mockReturnValueOnce({
        execute: async () => {
          return {
            getMethod: () => {
              return {
                inputs: [
                  {
                    name: 'config',
                  },
                ],
              };
            },
          };
        },
      });
      // @ts-ignore
      const httpCallMock2 = jest.spyOn(Poll.client, 'call').mockReturnValueOnce({
        execute: async () => {
          return '123';
        },
      });

      const res = await Poll._getMaxLimit();

      expect(res.toNumber()).toBe(123);
      expect(httpCallMock).toBeCalledTimes(1);
      expect(httpCallMock2).toBeCalledTimes(1);
    });
  });

  describe('add()', () => {
    // This is a real test which add new data to blockchain
    xit('should add new item to blockchain', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.createModel(
        'Poll',
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
      );

      const res = await Poll.add({ id: '1', name: 'Poll 1', body: 'Poll 1 test!' });
      expect(typeof res).toBe('string');
    }, 30000);

    it('should add new item to blockchain', async () => {
      const Poll = new IconBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const callMock = jest
        .spyOn(Poll, '_sendCallTransaction')
        .mockResolvedValueOnce('test_trx_id');

      const res = await Poll.add({ testparamcreate: '1' });
      expect(res).toEqual('test_trx_id');
      expect(callMock).toBeCalledWith('crepoll', { testparamcreate: '1' });
      expect(callMock).toBeCalledTimes(1);
    });
  });

  describe('get()', () => {
    // This is a real test which get data on blockchain
    xit('should get item info from blockchain', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.createModel(
        'Poll',
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
      );

      const res = await Poll.get({ id: '1' });
      expect(res).toEqual({ id: '1', name: 'Poll 1', body: 'Poll 1 test!' });
    }, 30000);

    it('should get item from blockchain', async () => {
      const CallBuilderMock = jest
        .spyOn(IconBuilder.CallBuilder.prototype, 'build')
        .mockReturnValueOnce(('test' as unknown) as Call);
      const Poll = new IconBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      // @ts-ignore
      const callMock = jest.spyOn(Poll.client, 'call').mockReturnValue({
        execute: async () => {
          return JSON.stringify({ id: 'test', name: 'test' });
        },
      });

      const res = await Poll.get({ id: '1' });
      expect(res).toEqual({ id: 'test', name: 'test' });
      expect(CallBuilderMock).toBeCalledTimes(1);
      expect(callMock).toBeCalledWith('test');
      expect(callMock).toBeCalledTimes(1);
    });
  });

  describe('update()', () => {
    // This is a real test which modify data on blockchain
    xit('should update item', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.createModel(
        'Poll',
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
      );

      const res = await Poll.update(
        { id: '1' },
        { name: 'Updated Poll 1', body: 'Updated Poll 1 test' },
      );
      expect(typeof res).toBe('string');
    }, 30000);

    it('should update item', async () => {
      const Poll = new IconBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const callMock = jest
        .spyOn(Poll, '_sendCallTransaction')
        .mockResolvedValueOnce('test_trx_id');

      const res = await Poll.update({ id: '1' }, { user: 'testuser', testparamupdate: 'test' });
      expect(res).toEqual('test_trx_id');
      expect(callMock).toBeCalledWith('updpoll', {
        id: '1',
        user: 'testuser',
        testparamupdate: 'test',
      });
      expect(callMock).toBeCalledTimes(1);
    });
  });

  describe('delete()', () => {
    // This is a real test which remove data on blockchain
    xit('should delete item from blockchain', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const Poll = await iconService.createModel(
        'Poll',
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
      );

      const res = await Poll.delete({ id: '1' });
      expect(typeof res).toBe('string');
    }, 30000);

    it('should delete item from blockchain', async () => {
      const Poll = new IconBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const callMock = jest
        .spyOn(Poll, '_sendCallTransaction')
        .mockResolvedValueOnce('test_trx_id');

      const res = await Poll.delete({ id: '1' });
      expect(res).toEqual('test_trx_id');
      expect(callMock).toBeCalledWith('delpoll', { id: '1' });
      expect(callMock).toBeCalledTimes(1);
    });
  });
});
