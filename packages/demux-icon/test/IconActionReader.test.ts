import fetch from 'node-fetch';

import { IconActionReader } from '../src';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

describe('test IconActionReader', () => {
  it('should get last block', done => {
    const actionReader = new IconActionReader({
      startAtBlock: 4194000,
      onlyIrreversible: false,
      endpoint: 'https://bicon.net.solidwallet.io/api/v3',
      nid: 3,
      jsonrpc: '2.0',
    });

    // @ts-ignore
    fetch.mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            id: 3,
            jsonrpc: '2.0',
            result: {
              block_hash: '2f55af0f518d1774c1a1565b814e9ccee4a2ee06b7c4744b1602ed61629e0a11',
              confirmed_transaction_list: [
                {
                  data: {
                    prep: {
                      irep: '0xa968163f0a57b400000',
                      rrep: '0x449',
                      totalDelegation: '0x18d92fa3589e6608f707c9',
                      value: '0x24a9c0534f5126dc',
                    },
                    result: {
                      coveredByFee: '0x0',
                      coveredByOverIssuedICX: '0x0',
                      issue: '0x24a9c0534f5126dc',
                    },
                  },
                  dataType: 'base',
                  timestamp: '0x5ae3c8d363934',
                  txHash: '0x54e1209ca9454553c31b7edd12b82bbbd4bd63b25460b32409e6f1a347d1d6af',
                  version: '0x3',
                },
              ],
              height: 6231596,
              merkle_tree_root_hash:
                '54e1209ca9454553c31b7edd12b82bbbd4bd63b25460b32409e6f1a347d1d6af',
              next_leader: 'hxaad52424d4aec9dac7d9f6796da527f471269d2c',
              peer_id: 'hxaad52424d4aec9dac7d9f6796da527f471269d2c',
              prev_block_hash: '94c99dfd4c1b13bcae5f139fd1a652a7216db833fc30cf21b8cf6bfd89eb2ad4',
              signature:
                'TKjNQ9jWeU2duujn4UdzuuxfqHcWNyurI3UbyPtNNCo4+/OZST0prxWBLf4UH36MMc0VjOJrFpmzPlQ+LoKD4gE=',
              time_stamp: 1598949973965108,
              version: '0.5',
            },
          }),
        ),
      ),
    );

    actionReader
      .getLastBlock()
      .then(res => {
        expect(fetch).toBeCalledWith('https://bicon.net.solidwallet.io/api/v3', {
          body: '{"jsonrpc":"2.0","id":3,"method":"icx_getLastBlock"}',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });

        expect(res).toEqual(
          expect.objectContaining({
            id: 3,
            jsonrpc: '2.0',
            result: expect.any(Object),
          }),
        );
      })
      .then(done);
  });
});
