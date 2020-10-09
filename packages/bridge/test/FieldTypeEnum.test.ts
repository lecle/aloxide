import { FieldTypeEnum } from "../src";

describe('FieldTypeEnum', () => {
  it('check supported type of FieldTypeEnum', () => {
    expect(Object.keys(FieldTypeEnum)).toEqual(["string", "number", "uint16_t", "uint32_t", "uint64_t", "bool", "account", "double"]);
  });
});