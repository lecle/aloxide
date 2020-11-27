import { NotInitializedError } from 'demux';
import { hyperionRawBlock, hyperionRawTransaction, hyperionActionMeta } from './hyperionRawData';
import { HyperionActionReader } from '../src/HyperionActionReader';
jest.mock('node-fetch');
import fetch from 'node-fetch';

describe('NodeosActionReader', () => {
  let reader: HyperionActionReader;
  const hyperionEndpoint = 'https://hyperion.testnet.canfoundation.io';

  beforeEach(() => {
    jest.resetAllMocks();
    reader = new HyperionActionReader({
      hyperionEndpoint,
      startAtBlock: 10,
      onlyIrreversible: false,
    });
  });

  it('should get action meta', async () => {
    const transactionId = '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2';
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return hyperionRawTransaction;
      },
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(response);

    // @ts-ignore
    const actionMeta = await reader.getActionMeta(transactionId);
    expect(actionMeta.length).toBe(10);
    expect(actionMeta[0].receiver).toBe(hyperionRawTransaction.actions[0].receipts[0].receiver);
  });

  it('should get action meta retry request', async () => {
    const transactionId = '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2';
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return hyperionRawTransaction;
      },
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);
    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);

    // @ts-ignore
    const actionMeta = await reader.getActionMeta(transactionId);
    expect(actionMeta.length).toBe(10);
    expect(actionMeta[0].receiver).toBe(hyperionRawTransaction.actions[0].receipts[0].receiver);
    expect(fetch).toBeCalledTimes(2);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v2/history/get_transaction?id=${transactionId}`);
  });

  it('should process block meta', async () => {
    // @ts-ignore
    const mockGetActionMeta = jest.spyOn(reader, 'getActionMeta');
    // @ts-ignore
    mockGetActionMeta.mockResolvedValueOnce(hyperionActionMeta);

    // @ts-ignore
    const processedBlockResult = await reader.processBlockMeta(hyperionRawBlock);
    expect(processedBlockResult.transactions[0].actions.length).toBe(10);
    expect(processedBlockResult.transactions[0].actions[1].receiver).toBe('eosio.token');
    expect(processedBlockResult.transactions[0].actions[1].data.from).toBe('iyeqsiu44wv4');
  });

  it('returns head block number', async () => {
    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id: '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
      head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      head_block_time: '2020-11-27T07:15:10.000',
      head_block_producer: 'test2.bp',
      virtual_block_cpu_limit: 100000000,
      virtual_block_net_limit: 1048576000,
      block_cpu_limit: 99900,
      block_net_limit: 1048576,
      server_version_string: 'v2.0.2',
      fork_db_head_block_num: 27982695,
      fork_db_head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93'
    };
    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return blockInfo;
      },
    });
    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);
    const blockNum = await reader.getHeadBlockNumber();
    expect(blockNum).toBe(blockInfo.head_block_num);
  });

  it('returns head block number retry', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id: '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
      head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      head_block_time: '2020-11-27T07:15:10.000',
      head_block_producer: 'test2.bp',
      virtual_block_cpu_limit: 100000000,
      virtual_block_net_limit: 1048576000,
      block_cpu_limit: 99900,
      block_net_limit: 1048576,
      server_version_string: 'v2.0.2',
      fork_db_head_block_num: 27982695,
      fork_db_head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93'
    };

    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return blockInfo;
      },
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);

    const blockNum = await reader.getHeadBlockNumber();
    expect(blockNum).toBe(blockInfo.head_block_num);
    // @ts-ignore
    expect(fetch).toBeCalledTimes(2);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v1/chain/get_info`);
  });

  it('returns last irreversible block number', async () => {
    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id: '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
      head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      head_block_time: '2020-11-27T07:15:10.000',
      head_block_producer: 'test2.bp',
      virtual_block_cpu_limit: 100000000,
      virtual_block_net_limit: 1048576000,
      block_cpu_limit: 99900,
      block_net_limit: 1048576,
      server_version_string: 'v2.0.2',
      fork_db_head_block_num: 27982695,
      fork_db_head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93'
    };
    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return blockInfo;
      },
    });
    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);
    const lastIrreversibleBlockNum = await reader.getLastIrreversibleBlockNumber();
    expect(lastIrreversibleBlockNum).toBe(blockInfo.last_irreversible_block_num);
  });

  it('returns last irreversible block number retry', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id: '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
      head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      head_block_time: '2020-11-27T07:15:10.000',
      head_block_producer: 'test2.bp',
      virtual_block_cpu_limit: 100000000,
      virtual_block_net_limit: 1048576000,
      block_cpu_limit: 99900,
      block_net_limit: 1048576,
      server_version_string: 'v2.0.2',
      fork_db_head_block_num: 27982695,
      fork_db_head_block_id: '01aafb67640063451af8bae0827c05541ae252253b9a63dde18e3351fe0ebb68',
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93'
    };

    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return blockInfo;
      },
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);

    const blockNum = await reader.getLastIrreversibleBlockNumber();
    expect(blockNum).toBe(blockInfo.last_irreversible_block_num);
    // @ts-ignore
    expect(fetch).toBeCalledTimes(2);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v1/chain/get_info`);
  });

  it('gets block with correct block number', async () => {
    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return hyperionRawBlock;
      },
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);
    // @ts-ignore
    const mockGetActionMeta = jest.spyOn(reader, 'getActionMeta');
    // @ts-ignore
    mockGetActionMeta.mockResolvedValueOnce(hyperionActionMeta);
    const block = await reader.getBlock(hyperionRawBlock.number);
    expect(block.blockInfo.blockNumber).toEqual(hyperionRawBlock.number);
    expect(block.actions.length).toBe(10);
    // @ts-ignore
    expect(fetch).toBeCalledTimes(1);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v1/trace_api/get_block`);
  });

  it('throws if not correctly initialized', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

    const result = reader.getNextBlock();
    await expect(result).rejects.toThrow(NotInitializedError);
  });
});
