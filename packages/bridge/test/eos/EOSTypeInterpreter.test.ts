import {FieldTypeEnum, EOSTypeInterpreter } from '../../src';

describe('EOSTypeInterpreter', () => {
  const ti = new EOSTypeInterpreter();

  it('resolve eos types', () => {
    expect(ti.interpret(FieldTypeEnum.number)).toEqual('double');
    expect(ti.interpret(FieldTypeEnum.double)).toEqual('double');

    expect(ti.interpret(FieldTypeEnum.uint16_t)).toEqual('uint16_t');
    expect(ti.interpret(FieldTypeEnum.uint32_t)).toEqual('uint32_t');
    expect(ti.interpret(FieldTypeEnum.uint64_t)).toEqual('uint64_t');
    expect(ti.interpret(FieldTypeEnum.string)).toEqual('std::string');
    expect(ti.interpret(FieldTypeEnum.bool)).toEqual('bool');
    expect(ti.interpret(FieldTypeEnum.account)).toEqual('eosio::name');

    const type = 'weird type';
    // @ts-ignore
    expect(() => ti.interpret(type)).toThrow(`unknow type ${type}`);
  });
});