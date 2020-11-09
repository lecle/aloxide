import { AloxideConfig } from '@aloxide/abstraction';
import { Field, FieldTypeEnum } from '@aloxide/bridge';
import { Sequelize } from 'sequelize';

import { ModelBuilder, SequelizeTypeInterpreter } from '../src';

describe('model', () => {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
  };

  const aloxideConfig: AloxideConfig = {
    entities: [
      {
        name: 'Poll',
        fields: [
          { name: 'id', type: 'uint64_t' },
          { name: 'name', type: 'string' },
          { name: 'body', type: 'string' },
          { name: 'isActive', type: 'bool' },
          { name: 'pollNumber', type: 'uint16_t' },
          { name: 'pollQuantity', type: 'uint32_t' },
          { name: 'address', type: 'account' },
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
      const modelBuilder = new ModelBuilder({
        aloxideConfig,
        logger,
      });

      expect(modelBuilder.aloxideConfig).toEqual(aloxideConfig);
      expect(modelBuilder.typeInterpreter).toBeTruthy();
    });

    it('set intepreter', () => {
      const typeInterpreter = new SequelizeTypeInterpreter();
      const modelBuilder = new ModelBuilder({
        aloxideConfig,
        typeInterpreter,
        logger,
      });

      expect(modelBuilder.aloxideConfig).toEqual(aloxideConfig);
      expect(modelBuilder.typeInterpreter).toEqual(typeInterpreter);
    });
  });

  it('shoudl build model', () => {
    const modelBuilder = new ModelBuilder({
      aloxideConfig,
      logger,
    });

    expect(modelBuilder.aloxideConfig).toEqual(aloxideConfig);

    const sequelize = new Sequelize('sqlite::memory:');
    const spyDefine = jest.spyOn(sequelize, 'define');
    // @ts-ignore
    const models = modelBuilder.build(sequelize);

    expect(models.length).toEqual(2);
    expect(spyDefine).toBeCalledTimes(2);
    expect(spyDefine).toHaveBeenNthCalledWith(1, 'Poll', expect.anything());
    expect(spyDefine).toHaveBeenNthCalledWith(2, 'Vote', expect.anything());
  });

  it('throw error if type is unknown', () => {
    const typeInterpreter = new SequelizeTypeInterpreter();
    const input = 'fake-type';
    // @ts-ignore
    expect(() => typeInterpreter.interpret(input)).toThrow(`unknow type ${input}`);
  });

  describe('mapField', () => {
    const typeInterpreter = new SequelizeTypeInterpreter();
    const fields: Field[] = [
      ...aloxideConfig.entities[0].fields,
      {
        name: 'id-field',
        type: FieldTypeEnum.uint16_t,
      },
      {
        name: 'id-field',
        type: FieldTypeEnum.uint32_t,
      },
      {
        name: 'id-field',
        type: FieldTypeEnum.uint64_t,
      },
      {
        name: 'id-field',
        type: FieldTypeEnum.double,
      },
      {
        name: 'id-field',
        type: FieldTypeEnum.number,
      },
    ];

    const spyInterpret = jest.spyOn(typeInterpreter, 'interpret');

    ModelBuilder.mapField(typeInterpreter, fields, 'id-field');

    fields.forEach((f, i) => {
      expect(spyInterpret).toHaveBeenNthCalledWith(i + 1, f);
    });
  });
});
