import { KnexModelBuilder, KnexTypeInterpreter } from '../src';
import createLoggerTest from './createLoggerTest';

import type { AloxideConfig } from '@aloxide/abstraction';

describe('model', () => {
  const logger = createLoggerTest();

  const aloxideConfig: AloxideConfig = {
    entities: [
      {
        name: 'Poll',
        fields: [
          { name: 'id', type: 'uint64_t' },
          { name: 'name', type: 'string' },
          { name: 'body', type: 'string' },
        ],
        key: 'id',
      },
      {
        name: 'Vote',
        fields: [
          { name: 'f1', type: 'string' },
          { name: 'f2', type: 'number' },
          { name: 'f3', type: 'uint16_t' },
          { name: 'f4', type: 'uint32_t' },
          { name: 'f5', type: 'uint64_t' },
          { name: 'f6', type: 'bool' },
          { name: 'f7', type: 'account' },
          { name: 'f8', type: 'double' },
        ],
        key: 'f1',
      },
    ],
  };

  describe('test constructor', () => {
    it('create default intepreter', () => {
      const modelBuilder = new KnexModelBuilder({
        aloxideConfig,
        logger,
      });

      expect(modelBuilder.aloxideConfig).toEqual(aloxideConfig);
      expect(modelBuilder.typeInterpreter).toBeTruthy();
    });

    it('set intepreter', () => {
      const typeInterpreter = new KnexTypeInterpreter();
      const modelBuilder = new KnexModelBuilder({
        aloxideConfig,
        typeInterpreter,
        logger,
      });

      expect(modelBuilder.aloxideConfig).toEqual(aloxideConfig);
      expect(modelBuilder.typeInterpreter).toEqual(typeInterpreter);
    });
  });

  it('shoudl build model', () => {
    const modelBuilder = new KnexModelBuilder({
      aloxideConfig,
      logger,
    });

    expect(modelBuilder.aloxideConfig).toEqual(aloxideConfig);

    const table = {
      integer: jest.fn(),
      boolean: jest.fn(),
      string: jest.fn(),
    };

    const schemaBuilder = {
      createTable: jest.fn((_, tableBuilder) => {
        tableBuilder(table);
        return schemaBuilder;
      }),
    };

    // @ts-ignore
    const models = modelBuilder.build(schemaBuilder);

    expect(models).toBeTruthy();
    expect(schemaBuilder.createTable).toBeCalledTimes(2);
    expect(schemaBuilder.createTable).toHaveBeenNthCalledWith(
      1,
      aloxideConfig.entities[0].name,
      expect.any(Function),
    );
    expect(schemaBuilder.createTable).toHaveBeenNthCalledWith(
      2,
      aloxideConfig.entities[1].name,
      expect.any(Function),
    );
    expect(table.integer).toBeCalledTimes(6);
    expect(table.boolean).toBeCalledTimes(1);
    expect(table.string).toBeCalledTimes(4);
  });

  it('throw error if type is unknown', () => {
    const typeInterpreter = new KnexTypeInterpreter();
    const input = 'fake-type';
    // @ts-ignore
    expect(() => typeInterpreter.interpret(input)).toThrow(`unknow type ${input}`);
  });
});
