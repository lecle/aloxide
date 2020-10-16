import { IconBlockchainModel, IconBlockchainService } from '../../../src/blockchain-services/icon';
import path from 'path';
import { Aloxide, BlockchainAccount, iconTestnetConfig } from '../../../src';

const ICON_TOKEN_PATH = path.resolve(__dirname, '../../resources/icon-source/icon_hello.zip');
const testConfig = Object.assign({}, iconTestnetConfig, {
  host: 'testnet.example.io',
  protocol: 'https',
});

describe('test IconBlockchainService', () => {
  describe('test IconBlockchainService creation', () => {
    it('should create IconBlockchainService successful', () => {
      const iconService = new IconBlockchainService(testConfig);

      expect(iconService).toBeDefined();
    });
  });

  describe('deployContract()', () => {
    /**
     * This is a real test case used to deploy sm to icon testnet
     * Used Account Address: hxe7af5fcfd8dfc67530a01a0e403882687528dfcb
     * Used Account Private key: 592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c
     */
    xit('Should deploy the contract ', async () => {
      const iconTestnetService = await Aloxide.createService(iconTestnetConfig);

      const trn = await iconTestnetService.deployContract(
        { psPath: ICON_TOKEN_PATH },
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        {
          // Update contract
          contract: 'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        },
      );

      expect(trn).toBeDefined();
    });
  });

  describe('getBalance()', () => {
    it('should return balance', async () => {
      const iconService = new IconBlockchainService(testConfig);
      // @ts-ignore
      const balanceMock = jest.spyOn(iconService.client, 'getBalance').mockReturnValueOnce({
        execute: () => {
          return 'test_result';
        },
      });

      const res = await iconService.getBalance('testAccount');
      expect(res).toBe('test_result');
      expect(balanceMock).toBeCalledWith('testAccount');
    });
  });

  describe('model()', () => {
    it('should create model', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const iconBcModel = await iconService.createModel(
        'Poll',
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
      );

      expect(iconBcModel).toBeDefined();
      expect(iconBcModel instanceof IconBlockchainModel).toBe(true);
    });

    it('should create Poll model', async () => {
      const iconService = new IconBlockchainService(testConfig);
      const data = [
        {
          name: 'crepoll',
          inputs: [
            {
              name: 'id',
              type: 'int',
            },
            {
              name: 'name',
              type: 'str',
            },
          ],
        },
        {
          name: 'updpoll',
          inputs: [
            {
              name: 'id',
              type: 'int',
            },
            {
              name: 'name',
              type: 'str',
            },
          ],
        },
      ];
      // @ts-ignore
      const abiMock = jest.spyOn(iconService.client, 'getScoreApi').mockReturnValueOnce({
        execute: async () => {
          return {
            getList: () => data,
          };
        },
      });

      const Poll = await iconService.createModel(
        'Poll',
        'testcontract',
        new BlockchainAccount('testaccount'),
      );
      expect(Poll instanceof IconBlockchainModel).toBe(true);
      expect(abiMock).toBeCalledTimes(1);
      expect(Poll.actions).toEqual([
        {
          name: 'crepoll',
          inputs: [
            { name: 'id', type: 'number' },
            { name: 'name', type: 'string' },
          ],
        },
        {
          name: 'updpoll',
          inputs: [
            { name: 'id', type: 'number' },
            { name: 'name', type: 'string' },
          ],
        },
      ]);
    });
  });
});
