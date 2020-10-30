import fetch from 'node-fetch';

import { IconActionReader } from '../src';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

const lastBlockResp = {
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
    merkle_tree_root_hash: '54e1209ca9454553c31b7edd12b82bbbd4bd63b25460b32409e6f1a347d1d6af',
    next_leader: 'hxaad52424d4aec9dac7d9f6796da527f471269d2c',
    peer_id: 'hxaad52424d4aec9dac7d9f6796da527f471269d2c',
    prev_block_hash: '94c99dfd4c1b13bcae5f139fd1a652a7216db833fc30cf21b8cf6bfd89eb2ad4',
    signature:
      'TKjNQ9jWeU2duujn4UdzuuxfqHcWNyurI3UbyPtNNCo4+/OZST0prxWBLf4UH36MMc0VjOJrFpmzPlQ+LoKD4gE=',
    time_stamp: 1598949973965108,
    version: '0.5',
  },
};

const getBlockByHeightResponse = {
  jsonrpc: '2.0',
  result: {
    version: '0.5',
    height: 6231596,
    signature:
      'TKjNQ9jWeU2duujn4UdzuuxfqHcWNyurI3UbyPtNNCo4+/OZST0prxWBLf4UH36MMc0VjOJrFpmzPlQ+LoKD4gE=',
    prev_block_hash: '2f55af0f518d1774c1a1565b814e9ccee4a2ee06b7c4744b1602ed61629e0a11',
    merkle_tree_root_hash: '54e1209ca9454553c31b7edd12b82bbbd4bd63b25460b32409e6f1a347d1d6af',
    time_stamp: 1598949973965108,
    confirmed_transaction_list: [
      {
        version: '0x3',
        timestamp: '0x5ae3c8d363934',
        dataType: 'base',
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
        txHash: '0x54e1209ca9454553c31b7edd12b82bbbd4bd63b25460b32409e6f1a347d1d6af',
      },
    ],
    block_hash: '2f55af0f518d1774c1a1565b814e9ccee4a2ee06b7c4744b1602ed61629e0a11',
    peer_id: 'hxaad52424d4aec9dac7d9f6796da527f471269d2c',
    next_leader: 'hxaad52424d4aec9dac7d9f6796da527f471269d2c',
  },
  id: 3,
};

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
    fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(lastBlockResp))));

    actionReader
      .getLastBlock()
      .then(res => {
        expect(fetch).toBeCalledWith('https://bicon.net.solidwallet.io/api/v3', {
          body: '{"jsonrpc":"2.0","method":"icx_getLastBlock","id":3}',
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
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

  it('should initialize', async () => {
    const actionReader = new IconActionReader({
      startAtBlock: 4194000,
      onlyIrreversible: false,
      endpoint: 'https://bicon.net.solidwallet.io/api/v3',
      nid: 3,
      jsonrpc: '2.0',
      numRetries: 1,
      waitTimeMs: 1000,
    });

    // @ts-ignore
    jest.spyOn(actionReader, 'getLastBlock').mockReturnValue(lastBlockResp);
    jest.spyOn(actionReader, 'post').mockResolvedValue(getBlockByHeightResponse);
    // @ts-ignore
    await expect(actionReader.setup()).resolves.not.toThrow();
    // @ts-ignore
    expect(await actionReader.getHeadBlockNumber()).toBe(6231596);
    // @ts-ignore
    expect(await actionReader.getLastIrreversibleBlockNumber()).toBe(6231596);
    // @ts-ignore
    expect(typeof (await actionReader.getBlock(6231596))).toBe('object');
  });

  it('setup should throw error', async () => {
    const actionReader = new IconActionReader();

    // @ts-ignore
    jest.spyOn(actionReader, 'getLastBlock').mockRejectedValue(new Error());
    // @ts-ignore
    await expect(actionReader.setup).rejects.toThrow(
      'The proper initialization has not occurred. Cannot reach supplied icon endpoint.',
    );
  });

  it(
    'getBlock should throw error',
    async () => {
      const actionReader = new IconActionReader({
        startAtBlock: 4194000,
        onlyIrreversible: false,
        numRetries: 1,
        waitTimeMs: 1000,
      });

      // @ts-ignore
      jest.spyOn(actionReader, 'post').mockRejectedValue(new Error());
      // @ts-ignore
      await expect(actionReader.getBlock(4194000)).rejects.toThrow(
        'Error block, max retries failed',
      );
    },
    300 * 1000,
  );

  it('getLastIrreversibleBlockNumber should throw error', async () => {
    const actionReader = new IconActionReader({
      startAtBlock: 4194000,
      onlyIrreversible: false,
      numRetries: 1,
      waitTimeMs: 1000,
    });

    // @ts-ignore
    jest.spyOn(actionReader, 'getLastBlock').mockRejectedValue(new Error());
    // @ts-ignore
    await expect(actionReader.getLastIrreversibleBlockNumber()).rejects.toThrow(
      'Error retrieving last irreversible block, max retries failed',
    );
  });

  it('getHeadBlockNumber should throw error', async () => {
    const actionReader = new IconActionReader({
      startAtBlock: 4194000,
      onlyIrreversible: false,
      numRetries: 1,
      waitTimeMs: 1000,
    });

    // @ts-ignore
    jest.spyOn(actionReader, 'getLastBlock').mockRejectedValue(new Error());
    // @ts-ignore
    await expect(actionReader.getHeadBlockNumber()).rejects.toThrow(
      'Error retrieving head block, max retries failed',
    );
  });
});
