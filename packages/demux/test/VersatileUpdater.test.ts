import { BlockInfo } from 'demux';
import { VersatileUpdater } from '../src/VersatileUpdater';

describe('test VersatileUpdater', () => {
  describe('VersatileUpdater creation', () => {
    it('should create VersatileUpdater with default "*" action type', () => {
      const updater = new VersatileUpdater();

      expect(updater.actionType).toBe('*');
    });

    it('should create VersatileUpdater with specified action type and logger', () => {
      const sampleLogger = {};
      const updater = new VersatileUpdater({
        actionType: 'account::action',
        logger: sampleLogger,
      });

      expect(updater.logger).toBe(sampleLogger);
      expect(updater.actionType).toEqual('account::action');
    });
  });

  describe('apply()', () => {
    it('should proceed data', () => {
      const updater = new VersatileUpdater();
      const blockInfo: BlockInfo = {
        blockHash: 'hash value',
        blockNumber: 123,
        previousBlockHash: 'hash value',
        timestamp: new Date(),
      };
      // @ts-ignore
      const handleDataMock = jest.spyOn(updater, 'handleData').mockResolvedValue([]);

      updater.apply(
        'test_state',
        {
          actionType: 'test_action',
        },
        blockInfo,
        'test_context',
      );
      expect(handleDataMock).toBeCalledWith('test_action', {
        state: 'test_state',
        payload: {
          actionType: 'test_action',
        },
        blockInfo,
        context: 'test_context',
      });
    });
  });

  describe('addHandler()', () => {
    it('should throw error when handler is not a function', () => {
      const updater = new VersatileUpdater();
      const handler = 'invalid_handler';

      expect(() => {
        // @ts-ignore
        updater.addHandler(handler);
      }).toThrowError('"handler" is required and must be a function');
    });

    it('should throw error when action name is not a string', () => {
      const updater = new VersatileUpdater();
      const handler = () => {};

      expect(() => {
        // @ts-ignore
        updater.addHandler(handler, {});
      }).toThrowError(
        '"actionName" must be a string and must contain account which this action belong to.',
      );

      expect(() => {
        updater.addHandler(handler, 'test_action');
      }).toThrowError(
        '"actionName" must be a string and must contain account which this action belong to.',
      );
    });

    it("should throw error when specified action name doesn't follow format which contain account name", () => {
      const updater = new VersatileUpdater();
      const handler = () => {};

      expect(() => {
        updater.addHandler(handler, '::test_action');
      }).toThrowError(
        '"actionName" must be a string and must contain account which this action belong to.',
      );
    });

    it('should not allow adding handler when action name is different to defined action type', () => {
      const updater = new VersatileUpdater({
        actionType: 'test_type',
      });
      const handler = () => {};
      const actionName = 'account::test_action';

      expect(() => {
        updater.addHandler(handler, actionName);
      }).toThrowError(`This Updater is used to handle "test_type" action only`);
    });

    it('should add handler to handle initialised action type by default', async () => {
      const updater = new VersatileUpdater({
        actionType: 'account::test_action',
      });
      const handler = jest.fn();
      const data = 'test_data';

      // Add handler without passing action name, it should add handle to handle `account::test_action` by default
      updater.addHandler(handler);

      // @ts-ignore
      await updater.handleData('account::test_action', data);

      expect(handler).toBeCalledTimes(1);
    });

    it('should allow to add handlers when action type is "*"', () => {
      const updater = new VersatileUpdater({
        actionType: '*',
      });
      const handler = () => {};
      const actionName = 'account::test_action';

      expect(updater.addHandler(handler, actionName)).toBe(true);
    });
  });

  describe('handleData()', () => {
    it("should not call any handlers if there's no action matched", async () => {
      const updater = new VersatileUpdater({
        actionType: '*',
      });
      const handler = jest.fn();
      const handler2 = jest.fn();
      const data = 'test_data';

      // Add handlers first
      updater.addHandler(handler, 'account::test_action');
      updater.addHandler(handler2, 'account::test_action');

      // @ts-ignore
      await updater.handleData('account::non-matched-action', data);

      expect(handler).toBeCalledTimes(0);
      expect(handler2).toBeCalledTimes(0);
    });

    it('should call all handlers', async () => {
      const updater = new VersatileUpdater({
        actionType: '*',
      });
      const handler = jest.fn();
      const handler2 = jest.fn();
      const actionName = 'account::test_action';
      const data = 'test_data';

      // Add handlers first
      updater.addHandler(handler, actionName);
      updater.addHandler(handler2, actionName);

      // @ts-ignore
      await updater.handleData(actionName, data);

      expect(handler).toBeCalledWith(data);
      expect(handler2).toBeCalledWith(data);
    });

    it('should call handler with custom scope', async () => {
      const updater = new VersatileUpdater({
        actionType: '*',
      });
      const scope = { sample_scope: 'sample_scope' };
      const handler = jest.fn(function () {
        // test scope
        expect(this).toBe(scope);
        // @ts-ignore
        expect(this.sample_scope).toBe('sample_scope');
      });

      const handler2 = jest.fn(function () {
        // test scope
        expect(this).toBe(scope);
        // @ts-ignore
        expect(this.sample_scope).toBe('sample_scope');
      });
      const actionName = 'account::test_action';
      const data = 'test_data';

      // Add handlers first
      updater.addHandler(handler, actionName);
      updater.addHandler(handler2, actionName);

      // @ts-ignore
      const res = await updater.handleData(actionName, data, scope);

      expect(handler).toBeCalledWith(data);
      expect(handler2).toBeCalledWith(data);
      expect.assertions(6);
    });
  });
});
