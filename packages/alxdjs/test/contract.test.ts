import CANTestnet from '../src/network-providers/can-testnet';
import ICONTestnet from '../src/network-providers/icon-testnet';
import AloxideSDK from '../src';
import IconService from 'icon-sdk-js';


const EOS_TOKEN_ABI_PATH = "./test/resources/eos-source/eosio.token.abi";
const EOS_TOKEN_WASM_PATH = "./test/resources/eos-source/eosio.token.wasm";
const ICON_TOKEN_PATH = "./test/resources/icon-source/standard_token.zip";
describe('Contract', function () {

  describe('Deploy eos contract to can testnet', function () {
    xit('Should deploy the contract ', async () => {
      const jungle = new CANTestnet();
      const client = new AloxideSDK(jungle);
      const deployAccount = client.EOS.Account.load("5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ", "aloxidejs123");
      const trn = await client.EOS.Contract.deployOnAccount(EOS_TOKEN_WASM_PATH, EOS_TOKEN_ABI_PATH, deployAccount);
      expect(trn.deployedAccount).toEqual(deployAccount);
      expect(trn.abiTx).toReturn();
      expect(trn.codeTx).toReturn();

    });
  });

  describe('Deploy icon contract to icon testnet', function () {
    xit('Should deploy the contract ', async () => {
      const icon_testnet = new ICONTestnet();
      const client = new AloxideSDK(icon_testnet);

      const initialSupply = IconService.IconConverter.toBigNumber("100000000000");
      const decimals = IconService.IconConverter.toBigNumber("18");
      const tokenName = "StandardToken";
      const tokenSymbol = "ST";
      const params = {
          initialSupply: IconService.IconConverter.toHex(initialSupply),
          decimals: IconService.IconConverter.toHex(decimals),
          name: tokenName,
          symbol: tokenSymbol
      }
      const deployAccount = client.ICON.Account.load("592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c");
      const trn = await client.ICON.Contract.deployOnAccount(ICON_TOKEN_PATH, params,  deployAccount);
      expect(trn).toReturn();

    });
  });

});