import { Aloxide, canTestnetConfig, iconTestnetConfig, BlockchainAccount } from '../src';
import { IconConverter } from 'icon-sdk-js';
import path from 'path';

const EOS_TOKEN_ABI_PATH = path.resolve(__dirname, './resources/eos-source/eosio.token.abi');
const EOS_TOKEN_WASM_PATH = path.resolve(__dirname, './resources/eos-source/eosio.token.wasm');
const ICON_TOKEN_PATH = path.resolve(__dirname, './resources/icon-source/standard_token.zip');
describe('Contract', () => {
  describe('Deploy eos contract to can testnet', () => {
    xit('Should deploy the contract ', async () => {
      const canTestnetService = await Aloxide.createService(canTestnetConfig);
      const trn = await canTestnetService.deployContract(
        { wasmPath: EOS_TOKEN_WASM_PATH, abiPath: EOS_TOKEN_ABI_PATH },
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      expect(trn.transaction_id).toBeDefined();
    });
  });

  describe('Deploy icon contract to icon testnet', () => {
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
});
