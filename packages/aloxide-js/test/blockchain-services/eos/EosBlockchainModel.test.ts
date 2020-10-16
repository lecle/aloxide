import { BlockchainAccount, canTestnetConfig } from '../../../src';
import { EosBlockchainService } from '../../../src/blockchain-services/eos';

describe('test EosBlockchainModel', () => {
  describe('get()', async () => {
    xit('should get item info from blockchain', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const Poll = await eosService.model(
        'Poll',
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
        'aloxidejs123',
      );

      const res = await Poll.get('1');
      expect(true).toBe(true);
    });
  });
});
