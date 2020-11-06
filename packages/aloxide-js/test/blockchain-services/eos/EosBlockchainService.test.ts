import { EosBlockchainModel, EosBlockchainService } from '../../../src/blockchain-services/eos';
import { BlockchainAccount, canTestnetConfig } from '../../../src';
import path from 'path';

const SM_ABI_PATH = path.resolve(__dirname, '../../resources/eos-source/hello.abi');
const SM_WASM_PATH = path.resolve(__dirname, '../../resources/eos-source/hello.wasm');
const testConfig = Object.assign({}, canTestnetConfig, {
  host: 'testnet.example.io',
  port: 443,
  protocol: 'https',
  coreToken: 'CAN',
});

jest.mock('../../../src/helpers/contract-files-reader');

describe('test EosBlockchainService', () => {
  beforeEach(() => {
    require('../../../src/helpers/contract-files-reader').__resetMockFileContent();
  });

  describe('test EosBlockchainService creation', () => {
    it('should create EosBlockchainService successful', () => {
      const eosService = new EosBlockchainService(testConfig);

      expect(eosService).toBeDefined();
    });

    it('should have some props, url() and unique() method when creating successfull', () => {
      const eosService = new EosBlockchainService(testConfig);

      expect(eosService.config).toEqual(testConfig);
      expect(typeof eosService.url).toBe('function');
      expect(typeof eosService.unique).toBe('function');
    });
  });

  describe('url()', () => {
    it('should return url based on config', () => {
      const eosService = new EosBlockchainService(testConfig);

      // make url with port
      testConfig.port = 443;
      expect(eosService.url()).toBe(
        `${testConfig.protocol}://${testConfig.host}:${testConfig.port}${
          testConfig.path ? '/' + testConfig.path : ''
        }`,
      );

      // make url without port
      testConfig.port = null;
      expect(eosService.url()).toBe(
        `${testConfig.protocol}://${testConfig.host}${
          testConfig.path ? '/' + testConfig.path : ''
        }`,
      );
    });
  });

  describe('unique()', () => {
    it('should generate unique string based on config', () => {
      const eosService = new EosBlockchainService(testConfig);

      expect(eosService.unique()).toBe(
        (
          `${testConfig.type}:` +
          (testConfig.chainId.length
            ? `chain:${testConfig.chainId}`
            : `${testConfig.host}:${testConfig.port}`)
        ).toLowerCase(),
      );
    });
  });

  describe('unique() empty chainId', () => {
    it('should generate unique string based on config', () => {
      const eosService = new EosBlockchainService(testConfig);
      testConfig.chainId = '';
      expect(eosService.unique()).toBe(
        (
          `${testConfig.type}:` +
          (testConfig.chainId.length
            ? `chain:${testConfig.chainId}`
            : `${testConfig.host}:${testConfig.port}`)
        ).toLowerCase(),
      );
    });
  });

  describe('deployContract()', () => {
    // This is a real test which deploys sm to CAN testnet
    xit('should deploy contract to EOS network', async () => {
      const canTestnetService = new EosBlockchainService(canTestnetConfig);
      const trn = await canTestnetService.deployContract(
        { wasmPath: SM_WASM_PATH, abiPath: SM_ABI_PATH },
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      expect(trn.transaction_id).toBeDefined();
    });

    it('should deploy contract to EOS network', async () => {
      require('../../../src/helpers/contract-files-reader').__setMockFileContent('test_abi', 'abi');
      require('../../../src/helpers/contract-files-reader').__setMockFileContent(
        'test_wasm',
        'wasm',
      );

      const testService = new EosBlockchainService(testConfig);
      const eosClientMock = jest
        .spyOn(testService.client, 'transact')
        .mockResolvedValueOnce({ transaction_id: 'trx_id' });
      const res = await testService.deployContract(
        { abiPath: 'some/path', wasmPath: 'some/other/path' },
        new BlockchainAccount('test_name', '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ'),
      );

      expect(res.transaction_id).toBe('trx_id');
      expect(eosClientMock).toBeCalledTimes(1);

      const eosClientCalledActionArgs: any = eosClientMock.mock.calls[0][0];
      const setCodeAction = eosClientCalledActionArgs.actions[0];
      const setAbiAction = eosClientCalledActionArgs.actions[1];
      expect(setCodeAction).toMatchObject({
        data: {
          account: 'test_name',
          code: 'test_wasm',
        },
      });

      expect(setAbiAction).toMatchObject({
        data: {
          account: 'test_name',
          abi: 'test_abi',
        },
      });
    });
  });

  describe('getBalance()', () => {
    it('should throw error when missing code or symbol', async () => {
      const testService = new EosBlockchainService(testConfig);

      // Missing code and symbol
      // @ts-ignore
      await expect(testService.getBalance('test_account')).rejects.toThrowError(
        '"Code" and "Symbol" are needed when getting balance from EOS Network',
      );

      // Mising symbol
      // @ts-ignore
      await expect(testService.getBalance('test_account', 'test_code')).rejects.toThrowError(
        '"Code" and "Symbol" are needed when getting balance from EOS Network',
      );
    });

    it('should return balance', async () => {
      const testService = new EosBlockchainService(testConfig);
      const rpcMock = jest
        .spyOn(testService.client.rpc, 'get_currency_balance')
        .mockResolvedValueOnce('test_result');

      const myBalance = await testService.getBalance('test_account', 'test_code', 'test_symbol');
      expect(myBalance).toBe('test_result');
      expect(rpcMock).toBeCalledWith('test_code', 'test_account', 'test_symbol');
    });
  });

  describe('model()', () => {
    // This is a real test which use CAN testnet network.
    xit('should create Poll model', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const Poll = await eosService.createModel(
        'Poll',
        'aloxidejs123',
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      expect(Poll).toBeDefined();
      expect(Poll.actions).toBeDefined();
    });

    it('should create Poll model', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const rpcMock = jest.spyOn(eosService.client.rpc, 'get_abi').mockResolvedValueOnce({
        // @ts-ignore
        abi: {
          structs: [
            {
              name: 'testpoll',
              fields: [
                { name: 'testparam1', type: 'name' },
                { name: 'testparam2', type: 'uint64' },
              ],
              base: '',
            },
            {
              name: 'poll',
              fields: [
                { name: 'testparam3', type: 'name' },
                { name: 'testparam4', type: 'uint64' },
              ],
              base: '',
            },
            {
              name: 'unknown',
              fields: [
                { name: 'testparam5', type: 'name' },
                { name: 'testparam6', type: 'uint64' },
              ],
              base: '',
            },
          ],
        },
      });
      const Poll = await eosService.createModel(
        'Poll',
        'testcontract',
        new BlockchainAccount('testaccount', '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      );

      expect(Poll instanceof EosBlockchainModel).toBe(true);
      expect(rpcMock).toBeCalledWith('testcontract');
      expect(Poll.actions).toEqual([
        {
          name: 'testpoll',
          inputs: [
            { name: 'testparam1', type: 'string' },
            { name: 'testparam2', type: 'number' },
          ],
        },
        {
          name: 'poll',
          inputs: [{ name: 'id', type: 'number' }],
        },
      ]);
    });
  });
});
