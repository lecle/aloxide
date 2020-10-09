import {FieldTypeEnum, ICONTypeInterpreter } from '../../src';

describe('ICONTypeInterpreter', () => {
  const ti = new ICONTypeInterpreter();

  it('resolve eos types', () => {
    expect(ti.interpret(FieldTypeEnum.number)).toEqual('int');
    expect(ti.interpret(FieldTypeEnum.double)).toEqual('int');

    expect(ti.interpret(FieldTypeEnum.uint16_t)).toEqual('int');
    expect(ti.interpret(FieldTypeEnum.uint32_t)).toEqual('int');
    expect(ti.interpret(FieldTypeEnum.uint64_t)).toEqual('int');
    expect(ti.interpret(FieldTypeEnum.string)).toEqual('str');
    expect(ti.interpret(FieldTypeEnum.bool)).toEqual('bool');
    expect(ti.interpret(FieldTypeEnum.account)).toEqual('Address');

    const type = 'weird type';
    // @ts-ignore
    expect(() => ti.interpret(type)).toThrow(`unknow type ${type}`);
  });
});