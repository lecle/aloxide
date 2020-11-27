import * as Logger from 'bunyan';
import { HyperionBlock } from '../src/HyperionBlock';
import { processedBlockMeta } from './hyperionRawData';

const log = Logger.createLogger({ name: 'HyperionBlockTest', level: 'error' });

describe('NodeosBlock', () => {
  let eosBlock: HyperionBlock;

  beforeEach(() => {
    eosBlock = new HyperionBlock(processedBlockMeta, log);
  });

  it('collects actions from blocks', async () => {
    const { actions, blockInfo } = eosBlock;
    expect(blockInfo.blockHash).toEqual(
      '01a808454f3aa21a1602478e2dbdbc5ebf0b735b226cdc344ea4e4a9d7141276',
    );
    expect(actions[0]).toEqual({
      type: 'cpu::freecpunet',
      payload: {
        producer: 'test3.bp',
        transactionId: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
        actionIndex: 0,
        receiver: 'cpu',
        account: 'cpu',
        action: 'freecpunet',
        authorization: [
          {
            account: 'cpu',
            permission: 'active',
          },
        ],
        data: {
          to: 'iyeqsiu44wv4',
          memo: 'pay cpu and net',
        },
      },
    });
  });
});
