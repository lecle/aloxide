import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { BlockchainAccount, canTestnetConfig } from '../../../src';
import { EosBlockchainModel, EosBlockchainService } from '../../../src/blockchain-services/eos';

describe('test EosBlockchaincreateModel', () => {
  const testActions = [
    {
      name: 'poll',
      inputs: [{ name: 'id', type: 'string' }],
    },
    {
      name: 'crepoll',
      inputs: [{ name: 'testparamcreate', type: 'string' }],
    },
    {
      name: 'updpoll',
      inputs: [
        { name: 'id', type: 'string' },
        { name: 'user', type: 'string' },
        { name: 'testparamupdate', type: 'string' },
      ],
    },
    {
      name: 'delpoll',
      inputs: [
        { name: 'id', type: 'string' },
        { name: 'user', type: 'string' },
      ],
    },
  ];
  const testUrl = 'https://testnet.example.io:443';
  const testKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

  describe('getAction()', () => {
    it('should throw error when getting action without name', () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');

      expect(() => {
        // @ts-ignore
        Poll.getAction();
      }).toThrowError('Action Name must be required!');
    });

    it('should throw error when action does not exist', () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');

      expect(() => {
        Poll.getAction('some_action_which_doesnt_exist');
      }).toThrowError('The Action named some_action_which_doesnt_exist does not exist');
    });

    it('should return action if exist', () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');
      const res = Poll.getAction('poll');
      expect(res).toBeDefined();
      expect(res.inputs).toEqual([{ name: 'id', type: 'string' }]);
    });
  });

  describe('configureAccount()', () => {
    it('should throw error when the input is not a Private Key string or instance of BlockchainAccount', () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');

      expect(() => {
        // @ts-ignore
        Poll.configureAccount(123);
      }).toThrowError('Account must be a Private Key string or an instance of Blockchain Account!');
    });

    it('should accept private key string as input and convert it to BlockchainAccount', () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');

      expect(Poll.account).toBeUndefined();

      Poll.configureAccount(testKey);
      expect(Poll.account).toBeDefined();
      expect(Poll.account instanceof BlockchainAccount).toBe(true);
    });

    it('should set account for model to use', () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');
      const signatureProvider = (Poll.client.signatureProvider as unknown) as JsSignatureProvider;

      expect(Poll.account).toBeUndefined();
      expect(Array.from(signatureProvider.keys.values()).length).toBe(0);
      expect(signatureProvider.availableKeys.length).toBe(0);

      Poll.configureAccount(new BlockchainAccount('testaccount', testKey));
      expect(Poll.account).toBeDefined();
      expect(Poll.account.name).toBe('testaccount');
      expect(Poll.account.privateKey).toBe('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3');
      expect(Array.from(signatureProvider.keys.values()).length).toBe(1);
      expect(signatureProvider.availableKeys.length).toBe(1);
    });
  });

  describe('_sendTransaction()', () => {
    it('should send transaction based on action and params', async () => {
      const Poll = new EosBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const transactionMock = jest.spyOn(Poll.client, 'transact').mockResolvedValue('test_result');

      const res = await Poll._sendTransaction('test_action', { id: 'test_id' });
      expect(res).toBe('test_result');
      expect(transactionMock).toBeCalledWith(
        expect.objectContaining({
          actions: [
            {
              account: 'testaccount',
              name: 'test_action',
              authorization: [
                {
                  actor: 'testaccount',
                  permission: 'active',
                },
              ],
              data: { id: 'test_id' },
            },
          ],
        }),
        {
          expireSeconds: 30,
          blocksBehind: 0,
        },
      );
    });
  });

  describe('get()', () => {
    // This is a real test which get item from blockchain
    xit('should get item info from blockchain', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const Poll = await eosService.createModel(
        'Poll',
        'aloxidejs123',
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      const res = await Poll.get({ id: '1' });
      expect(res).toBeDefined();
    });

    it('should get item info from blockchain using account and contract', async () => {
      const Poll = new EosBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const rpcMock = jest.spyOn(Poll.client.rpc, 'get_table_rows').mockResolvedValueOnce({
        rows: [
          {
            id: 'test',
            name: 'test',
          },
        ],
      });

      const res = await Poll.get({ id: '1' });
      expect(res).toEqual({ id: 'test', name: 'test' });
      expect(rpcMock).toBeCalledWith(
        expect.objectContaining({
          code: 'testcontract',
          scope: 'testaccount',
          lower_bound: '1',
          upper_bound: '1',
        }),
      );
      expect(rpcMock).toBeCalledTimes(1);
    });

    it('should get item info from blockchain with empty scope', async () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');
      const rpcMock = jest.spyOn(Poll.client.rpc, 'get_table_rows').mockResolvedValueOnce({
        rows: [],
      });

      const res = await Poll.get({ id: '1' });
      expect(res).toEqual(undefined);
      expect(rpcMock).toBeCalledWith(expect.objectContaining({ scope: undefined }));
      expect(rpcMock).toBeCalledTimes(1);
    });
  });

  describe('add()', () => {
    // This is a real test which add new item to blockchain
    xit('should add item to blockchain', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const Poll = await eosService.createModel(
        'Poll',
        'aloxidejs123',
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      const res = await Poll.add({ id: '1', name: 'Poll 1', body: 'Poll test 1' });
      expect(res).toBeDefined();
    });

    it('should add item to blockchain', async () => {
      const Poll = new EosBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const sendTransactionMock = jest
        .spyOn(Poll, '_sendTransaction')
        .mockResolvedValueOnce({ transaction_id: 'trx_id_test' });

      const res = await Poll.add({ testparamcreate: 'test' });
      expect(res).toEqual('trx_id_test');
      expect(sendTransactionMock).toBeCalledWith('crepoll', { testparamcreate: 'test' });
      expect(sendTransactionMock).toBeCalledTimes(1);
    });

    it('should add item to blockchain with user', async () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');
      const sendTransactionMock = jest
        .spyOn(Poll, '_sendTransaction')
        .mockResolvedValueOnce({ transaction_id: 'trx_id_test' });

      const res = await Poll.add({ testparamcreate: 'test', user: 'testaccount' });
      expect(res).toEqual('trx_id_test');
      expect(sendTransactionMock).toBeCalledWith('crepoll', { testparamcreate: 'test' });
      expect(sendTransactionMock).toBeCalledTimes(1);
    });
  });

  describe('update()', () => {
    // This is a real test which update item on blockchain
    xit('should update item on blockchain', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const Poll = await eosService.createModel(
        'Poll',
        'aloxidejs123',
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      const res = await Poll.update(
        { id: '1' },
        { name: 'Updated Poll 1', body: 'Updated Poll test 1' },
      );
      expect(res).toBeDefined();
    });

    it('should update item on blockchain', async () => {
      const Poll = new EosBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const sendTransactionMock = jest
        .spyOn(Poll, '_sendTransaction')
        .mockResolvedValueOnce({ transaction_id: 'trx_id_test' });

      const res = await Poll.update({ id: '1' }, { testparamupdate: 'test' });
      expect(res).toEqual('trx_id_test');
      expect(sendTransactionMock).toBeCalledWith('updpoll', {
        id: '1',
        user: 'testaccount',
        testparamupdate: 'test',
      });
      expect(sendTransactionMock).toBeCalledTimes(1);
    });

    it('should update item on blockchain', async () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');
      const sendTransactionMock = jest
        .spyOn(Poll, '_sendTransaction')
        .mockResolvedValueOnce({ transaction_id: 'trx_id_test' });

      const res = await Poll.update({ id: '1' }, { testparamupdate: 'test', user: 'testaccount' });
      expect(res).toEqual('trx_id_test');
      expect(sendTransactionMock).toBeCalledWith('updpoll', {
        id: '1',
        user: 'testaccount',
        testparamupdate: 'test',
      });
      expect(sendTransactionMock).toBeCalledTimes(1);
    });
  });

  describe('delete()', () => {
    // This is a real test which remove item from blockchain
    xit('should remove item from blockchain', async () => {
      const eosService = new EosBlockchainService(canTestnetConfig);
      const Poll = await eosService.createModel(
        'Poll',
        'aloxidejs123',
        new BlockchainAccount(
          'aloxidejs123',
          '5JHQ3GuzcQtEQgG3SGvtDU7v2b7ioKznYBizA1V5mBUUsLNcXdQ',
        ),
      );

      const res = await Poll.delete({ id: '1' });
      expect(res).toBeDefined();
    });

    it('should remove item from blockchain', async () => {
      const Poll = new EosBlockchainModel(
        'Poll',
        testUrl,
        testActions,
        'testcontract',
        new BlockchainAccount('testaccount', testKey),
      );
      const sendTransactionMock = jest
        .spyOn(Poll, '_sendTransaction')
        .mockResolvedValueOnce({ transaction_id: 'trx_id_test' });

      const res = await Poll.delete({ id: '1' });
      expect(res).toEqual('trx_id_test');
      expect(sendTransactionMock).toBeCalledWith('delpoll', { id: '1', user: 'testaccount' });
      expect(sendTransactionMock).toBeCalledTimes(1);
    });

    it('should remove item from blockchain', async () => {
      const Poll = new EosBlockchainModel('Poll', testUrl, testActions, 'testcontract');
      const sendTransactionMock = jest
        .spyOn(Poll, '_sendTransaction')
        .mockResolvedValueOnce({ transaction_id: 'trx_id_test' });

      const res = await Poll.delete({ id: '1' }, 'testaccount');
      expect(res).toEqual('trx_id_test');
      expect(sendTransactionMock).toBeCalledWith('delpoll', { id: '1', user: 'testaccount' });
      expect(sendTransactionMock).toBeCalledTimes(1);
    });
  });
});
