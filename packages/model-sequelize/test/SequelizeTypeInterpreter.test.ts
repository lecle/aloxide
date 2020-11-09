import { FieldTypeEnum } from '@aloxide/bridge';
import { DataTypes } from 'sequelize';

import { SequelizeTypeInterpreter } from '../src';

describe('SequelizeTypeInterpreter', () => {
  const interpreter = new SequelizeTypeInterpreter();

  it('string without metatdata', () => {
    expect(
      interpreter.interpret({
        type: FieldTypeEnum.string,
        name: 'any-name',
      }),
    ).toEqual(DataTypes.TEXT);
  });

  it('string with specify length', () => {
    expect(
      interpreter.interpret({
        type: FieldTypeEnum.string,
        name: 'any-name',
        meta: {
          length: 54,
        },
      }),
    ).toEqual(DataTypes.STRING(54));
  });

  it('string with specify type', () => {
    expect(
      interpreter.interpret({
        type: FieldTypeEnum.string,
        name: 'any-name',
        meta: {
          type: 'tiny',
        },
      }),
    ).toEqual(
      DataTypes.TEXT({
        length: 'tiny',
      }),
    );
  });

  it('has meta but no metadata was provided', () => {
    expect(
      interpreter.interpret({
        type: FieldTypeEnum.string,
        name: 'any-name',
        meta: {},
      }),
    ).toEqual(DataTypes.TEXT);
  });
});
