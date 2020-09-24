import { EntityConfig, FieldTypeEnum } from '@aloxide/bridge';

import { DbUpdater, DbUpdaterActionPayload, DbUpdaterOptions } from '../src';
import createLoggerTest from './createLoggerTest';

describe('test DbUpdater', () => {
  const entity: EntityConfig = {
    name: 'any name',
    fields: [
      {
        name: 'any name',
        type: FieldTypeEnum.string,
      },
      {
        name: 'key-field',
        type: FieldTypeEnum.number,
      },
    ],
    key: 'key-field',
  };

  it('create instance of DbUpdater', () => {
    const option: DbUpdaterOptions<any, any> = {
      actionType: 'aa',
      dataAdapter: null,
      entity,
      logger: createLoggerTest(),
    };
    const d = new DbUpdater(option);

    expect(d.actionType).toEqual(option.actionType);
    expect(d.entity).toEqual(option.entity);
    expect(d.logger).toEqual(option.logger);
    expect(d.dataAdapter).toEqual(option.dataAdapter);
  });

  describe('test method apply', () => {
    const payload: DbUpdaterActionPayload = {
      data: {},
    };
    const blockInfo = null;
    const context = null;

    describe('apply cre', () => {
      it('apply cre', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa::cre',
          // @ts-ignore
          dataAdapter: {
            create: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: createLoggerTest(),
        };
        const d = new DbUpdater(option);
        await d.apply(null, payload, blockInfo, context);

        expect(option.dataAdapter.create).toBeCalledTimes(1);
        expect(option.dataAdapter.create).toBeCalledWith(
          'any name',
          {},
          {
            blockInfo,
            context,
            entity,
          },
        );
      });
    });

    describe('apply upd', () => {
      it('apply upd', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa::upd',
          // @ts-ignore
          dataAdapter: {
            update: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: createLoggerTest(),
        };
        const d = new DbUpdater(option);
        await d.apply(null, payload, blockInfo, context);

        expect(option.dataAdapter.update).toBeCalledTimes(1);
        expect(option.dataAdapter.update).toBeCalledWith(
          'any name',
          {},
          {
            blockInfo,
            context,
            entity,
          },
        );
      });
    });

    describe('apply del', () => {
      it('apply del', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa::del',
          // @ts-ignore
          dataAdapter: {
            delete: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: createLoggerTest(),
        };
        const d = new DbUpdater(option);
        await d.apply(null, { ...payload, data: { ['key-field']: 5 } }, blockInfo, context);

        expect(option.dataAdapter.delete).toBeCalledTimes(1);
        expect(option.dataAdapter.delete).toBeCalledWith('any name', 5, {
          blockInfo,
          context,
          entity,
        });
      });
    });

    describe('increase coverage', () => {
      it('payload.data is null', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa::cre',
          // @ts-ignore
          dataAdapter: {
            create: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: createLoggerTest(),
        };
        const d = new DbUpdater(option);
        await expect(
          d.apply(null, { ...payload, data: null }, blockInfo, context),
        ).resolves.toBeFalsy();
        expect(option.logger.warn).toBeCalledWith('payload.data is null');
      });

      it('remove `user` from payload.data', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa::cre',
          // @ts-ignore
          dataAdapter: {
            create: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: createLoggerTest(),
        };
        const d = new DbUpdater(option);
        await expect(
          d.apply(null, { ...payload, data: { user: '5', e: 1 } }, blockInfo, context),
        ).resolves.toBeFalsy();
        expect(option.dataAdapter.create).toBeCalledWith('any name', Object.freeze({ e: 1 }), {
          blockInfo,
          context,
          entity,
        });
      });

      it('remove `user` from payload.data', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa:cre',
          // @ts-ignore
          dataAdapter: {
            create: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: createLoggerTest(),
        };
        const d = new DbUpdater(option);
        await expect(
          d.apply(null, { ...payload, data: { user: '5', e: 1 } }, blockInfo, context),
        ).resolves.toBeFalsy();
        expect(option.dataAdapter.create).not.toBeCalled();
        expect(option.logger.warn).toBeCalledWith(`don't know action type: ${option.actionType}`);
      });

      it('logger is null', async () => {
        const option: DbUpdaterOptions<any, any> = {
          actionType: 'aa:cre',
          // @ts-ignore
          dataAdapter: {
            create: jest.fn().mockResolvedValue(Promise.resolve({})),
          },
          entity,
          logger: null,
        };
        const d = new DbUpdater(option);
        await expect(
          d.apply(null, { ...payload, data: { user: '5', e: 1 } }, blockInfo, context),
        ).resolves.toBeFalsy();
        expect(option.dataAdapter.create).not.toBeCalled();

        await expect(
          d.apply(null, { ...payload, data: undefined }, blockInfo, context),
        ).resolves.toBeFalsy();
        expect(d.logger).toBeFalsy();
      });
    });
  });
});
