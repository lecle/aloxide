import * as http from 'http';
import * as https from 'https';
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

  it('should initilize reader', async () => {
    const localReader = new HyperionActionReader({
      startAtBlock: 10,
      onlyIrreversible: false,
    });

    const onlineReader = new HyperionActionReader({
      hyperionEndpoint,
      startAtBlock: 10,
      onlyIrreversible: false,
    });

    const defaultEndpoint = new HyperionActionReader();

    // @ts-ignore
    expect(localReader.hyperionEndpoint).toBe('http://localhost:8888');
    // @ts-ignore
    expect(onlineReader.hyperionEndpoint).toBe(hyperionEndpoint);
    // @ts-ignore
    expect(defaultEndpoint.hyperionEndpoint).toBe('http://localhost:8888');
  });

  it('should get connection agent', async () => {
    const httpURL = {
      protocol: 'http:',
    };

    const httpsURL = {
      protocol: 'https:',
    };

    // @ts-ignore
    const httpConnection = await reader.getConnectionAgent(httpURL);

    // @ts-ignore
    const currentHttpConnection = await reader.getConnectionAgent(httpURL);

    // @ts-ignore
    const httpsConnection = await reader.getConnectionAgent(httpsURL);

    // @ts-ignore
    const currentHttpsConnection = await reader.getConnectionAgent(httpsURL);

    expect(httpConnection).toBeInstanceOf(http.Agent);
    expect(httpsConnection).toBeInstanceOf(https.Agent);
    expect(currentHttpConnection).toBe(currentHttpConnection);
    expect(currentHttpsConnection).toBe(httpsConnection);
  });

  it('should check transaction include meta action', async () => {
    const sampleAction = {
      receiver: 'eosio',
      account: 'daniel111111',
      action: 'newaccount',
      authorization: [
        {
          account: 'daniel111111',
          permission: 'active',
        },
      ],
    };

    const newAccountTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [sampleAction],
    };

    const updateAuthTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'updateauth' }],
    };

    const unstaketorexTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'unstaketorex' }],
    };

    const buyrexTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'buyrex' }],
    };

    const buyramTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'buyram' }],
    };

    const buyrambytesTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'buyrambytes' }],
    };

    const undelegatebwTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'undelegatebw' }],
    };

    const delegatebwTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'delegatebw' }],
    };

    const linkauthTransaction = {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [{ ...sampleAction, action: 'linkauth' }],
    };

    // @ts-ignore
    const result1 = await reader.includeMetaAction(newAccountTransaction);
    // @ts-ignore
    const result2 = await reader.includeMetaAction(updateAuthTransaction);
    // @ts-ignore
    const result3 = await reader.includeMetaAction(unstaketorexTransaction);
    // @ts-ignore
    const result4 = await reader.includeMetaAction(buyrexTransaction);
    // @ts-ignore
    const result5 = await reader.includeMetaAction(buyramTransaction);
    // @ts-ignore
    const result6 = await reader.includeMetaAction(buyrambytesTransaction);
    // @ts-ignore
    const result7 = await reader.includeMetaAction(undelegatebwTransaction);
    // @ts-ignore
    const result8 = await reader.includeMetaAction(delegatebwTransaction);
    // @ts-ignore
    const result9 = await reader.includeMetaAction(linkauthTransaction);

    expect(
      result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8,
    ).toBe(true);

    expect(result9).toBe(false);
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

  it('should get action meta return empty if transaction has no action', async () => {
    const transactionId = '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2';
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return {
          executed: true,
          trx_id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
          lib: 27962634,
          query_time_ms: 31.314,
        };
      },
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(response);

    // @ts-ignore
    const actionMeta = await reader.getActionMeta(transactionId);
    expect(actionMeta.length).toBe(0);
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
    expect(fetch.mock.calls[0][0]).toBe(
      `${hyperionEndpoint}/v2/history/get_transaction?id=${transactionId}`,
    );
  });

  it('should get action meta throw error if max retry request failed', async () => {
    const transactionId = '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2';
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

    // @ts-ignore
    await expect(reader.getActionMeta(transactionId, 1, 100)).rejects.toThrowError(
      'Error get action meta, max retries failed',
    );
    expect(fetch).toBeCalledTimes(1);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(
      `${hyperionEndpoint}/v2/history/get_transaction?id=${transactionId}`,
    );
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

  it('should process block meta without meta action', async () => {
    // @ts-ignore
    const mockGetActionMeta = jest.spyOn(reader, 'getActionMeta');
    // @ts-ignore
    mockGetActionMeta.mockResolvedValueOnce(hyperionActionMeta);

    // @ts-ignore
    const processedBlockResult = await reader.processBlockMeta({
      query_time_ms: 12.014,
      id: '01a808454f3aa21a1602478e2dbdbc5ebf0b735b226cdc344ea4e4a9d7141276',
      number: 27789381,
      previous_id: '01a80844388a2285339b279b14cd25cb32e905edfeb2895a7e47b5c8e1da99dd',
      status: 'irreversible',
      timestamp: '2020-11-26T04:24:13.000',
      producer: 'test3.bp',
      transactions: [
        {
          id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
          actions: [
            {
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
          ],
        },
      ],
    });
    expect(processedBlockResult.transactions[0].actions.length).toBe(1);
    expect(processedBlockResult.transactions[0].actions[0].receiver).toBe('cpu');
    expect(processedBlockResult.transactions[0].actions[0].data.to).toBe('iyeqsiu44wv4');

    expect(mockGetActionMeta).toBeCalledTimes(0);
  });

  it('returns head block number', async () => {
    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id:
        '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
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
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93',
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
      last_irreversible_block_id:
        '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
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
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93',
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

  it('returns head block number throw error max retries failed', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

    await expect(reader.getHeadBlockNumber(1, 100)).rejects.toThrowError(
      'Error retrieving head block, max retries failed',
    );
    // @ts-ignore
    expect(fetch).toBeCalledTimes(1);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v1/chain/get_info`);
  });

  it('returns last irreversible block number', async () => {
    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id:
        '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
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
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93',
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
      last_irreversible_block_id:
        '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
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
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93',
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

  it('returns last irreversible block number throw error max retries failed', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

    await expect(reader.getLastIrreversibleBlockNumber(1, 100)).rejects.toThrowError(
      'Error retrieving last irreversible block, max retries failed',
    );
    // @ts-ignore
    expect(fetch).toBeCalledTimes(1);
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

  it('gets block with correct block number retry', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);

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
    expect(fetch).toBeCalledTimes(2);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v1/trace_api/get_block`);
  });

  it('gets block with correct block number throw error max retries failed', async () => {
    const responseError = Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal server error',
    });

    // @ts-ignore
    fetch.mockReturnValueOnce(responseError);
    await expect(reader.getBlock(hyperionRawBlock.number, 1, 100)).rejects.toThrowError(
      'Error block, max retries failed',
    );
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

  it('do not initialize again', async () => {
    // @ts-ignore
    reader.initialized = true;

    // @ts-ignore
    const result = await reader.setup();
    expect(fetch).toBeCalledTimes(0);
  });

  it('should initialize successfully', async () => {
    const blockInfo = {
      server_version: '3ce1a372',
      chain_id: '353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb',
      head_block_num: 27982695,
      last_irreversible_block_num: 27982650,
      last_irreversible_block_id:
        '01aafb3a81f6607ec7d8812a576c19b5c21429ad0c3aec5bcc3eeb9f2bc67fb5',
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
      server_full_version_string: 'v2.0.2-3ce1a372159d5e1b65f9031b29f8def631ee5e93',
    };

    const responseSuccess = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return blockInfo;
      },
    });
    // @ts-ignore
    reader.initialized = false;

    // @ts-ignore
    fetch.mockReturnValueOnce(responseSuccess);
    // @ts-ignore
    await reader.setup();
    expect(fetch).toBeCalledTimes(1);
    // @ts-ignore
    expect(fetch.mock.calls[0][0]).toBe(`${hyperionEndpoint}/v1/chain/get_info`);
  });
});
