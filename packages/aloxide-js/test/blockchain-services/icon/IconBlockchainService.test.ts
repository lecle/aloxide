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
        new BlockchainAccount(
          'hxe7af5fcfd8dfc67530a01a0e403882687528dfcb',
          '592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c',
        ),
        {
          // Update contract
          contract: 'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        },
      );

      expect(trn).toBeDefined();
    }, 30000);

    it('Should deploy the contract', async () => {
      const iconTestnetService = await Aloxide.createService(iconTestnetConfig);
      jest
        // @ts-ignore
        .spyOn(iconTestnetService.client, 'getScoreApi')
        .mockReturnValueOnce({
          // @ts-ignore
          execute: async () => {
            return {
              getMethod: methodName => {
                return {
                  name: 'getMaxStepLimit',
                  type: 'function',
                  inputs: [{ name: 'contextType', type: 'str' }],
                  outputs: [{ type: 'int' }],
                  readonly: '0x1',
                };
              },
            };
          },
        });

      jest
        // @ts-ignore
        .spyOn(iconTestnetService.client, 'call')
        .mockReturnValue({
          // @ts-ignore
          execute: async () => {
            return '0x9502f900';
          },
        });

      jest
        // @ts-ignore
        .spyOn(iconTestnetService.client, 'sendTransaction')
        .mockReturnValue({
          // @ts-ignore
          execute: async () => {
            return '0x5bf03aa6d9d1e6a0ec9a4138ef74a3b89ea0b071d8662d07233155544dcee972';
          },
        });

      const trn = await iconTestnetService.deployContract(
        { psPath: ICON_TOKEN_PATH },
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        {
          // Update contract
          contract: 'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
        },
      );

      expect(trn).toBeDefined();
      expect(trn).toBe('0x5bf03aa6d9d1e6a0ec9a4138ef74a3b89ea0b071d8662d07233155544dcee972');
    });

    it('Should deploy the contract without contract', async () => {
      const iconTestnetService = await Aloxide.createService(iconTestnetConfig);
      jest
        // @ts-ignore
        .spyOn(iconTestnetService.client, 'getScoreApi')
        .mockReturnValueOnce({
          // @ts-ignore
          execute: async () => {
            return {
              getMethod: methodName => {
                return {
                  name: 'getMaxStepLimit',
                  type: 'function',
                  inputs: [{ name: 'contextType', type: 'str' }],
                  outputs: [{ type: 'int' }],
                  readonly: '0x1',
                };
              },
            };
          },
        });

      jest
        // @ts-ignore
        .spyOn(iconTestnetService.client, 'call')
        .mockReturnValue({
          // @ts-ignore
          execute: async () => {
            return '0x9502f900';
          },
        });

      jest
        // @ts-ignore
        .spyOn(iconTestnetService.client, 'sendTransaction')
        .mockReturnValue({
          // @ts-ignore
          execute: async () => {
            return '0x7d780f8ca721aedb90ad488e4d129ed4a2c446fa43189dc1b2128fb8623889a3';
          },
        });

      const trn = await iconTestnetService.deployContract(
        { psPath: ICON_TOKEN_PATH },
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
      );

      expect(trn).toBeDefined();
      expect(trn).toBe('0x7d780f8ca721aedb90ad488e4d129ed4a2c446fa43189dc1b2128fb8623889a3');
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
    xit('should create model', async () => {
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
