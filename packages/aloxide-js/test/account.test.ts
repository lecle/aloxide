import CANTestnet from '../src/network-providers/can-testnet';
import ICONTestnet from '../src/network-providers/icon-testnet';
import AloxideSDK from '../src';

describe('Account', () => {

  describe('load EOS Account', () => {

    it('Should not load EOS account ', async () => {
      const jungle = new CANTestnet();
      const client = new AloxideSDK(jungle);
      expect(() => {
        client.EOS.Account.load('wrong privateKey', 'aloxidejs123');
      }).toThrowError('Invalid private key. Invalid checksum');

    });

    it('Should load EOS account ', async () => {
      const jungle = new CANTestnet();
      const client = new AloxideSDK(jungle);
      const account = client.EOS.Account.load('5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ', 'aloxidejs123');
      expect(account.name).toEqual('aloxidejs123');
      expect(account.privateKey).toEqual('5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ');
      expect(account.eosjs).toBeInstanceOf(Object);

    });
  });


  describe('load ICON Account', () => {

    it('Should not load ICON account ', async () => {
      const icon = new ICONTestnet();
      const client = new AloxideSDK(icon);
      expect(() => {
        client.ICON.Account.load('wrong privateKey');
      }).toThrowError('Invalid private key. Invalid checksum');

    });

    it('Should load ICON account ', async () => {
      const icon = new ICONTestnet();
      const client = new AloxideSDK(icon);
      const account = client.ICON.Account.load('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c');
      expect(account.privateKey).toEqual('592eb276d534e2c41a2d9356c0ab262dc233d87e4dd71ce705ec130a8d27ff0c');
      expect(account.iconsdk).toBeInstanceOf(Object);

    });
  });
});