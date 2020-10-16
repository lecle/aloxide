import { IconBlockchainService } from '../../../src/blockchain-services/icon';
import path from 'path';
import { Aloxide, BlockchainAccount, iconTestnetConfig } from '../../../src';

const ICON_TOKEN_PATH = path.resolve(__dirname, '../../resources/icon-source/icon_hello.zip');
const testConfig = Object.assign({}, iconTestnetConfig, {
  host: 'testnet.example.io',
  protocol: 'https',
});

describe('test IconBlockchainService', () => {
  describe('test IconBlockchainService creation', () => {
    it.todo('should create IconBlockchainService successful');
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
      );

      expect(trn).toBeDefined();
    });
  });

  describe('model()', () => {
    xit('should create model', async () => {
      const iconService = new IconBlockchainService(iconTestnetConfig);
      const iconBcModel = await iconService.model(
        'Poll',
        new BlockchainAccount('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c'),
        'cx26d2757d45ea7e559940d86761330005b0e9f2d8',
      );

      expect(true).toBe(true);
    });
  });
});
