import isHex from '../src/isHex';

describe('hex to number', () => {
  it('check whether it is hex', () => {
    expect(isHex(0)).toEqual(false);
    expect(isHex('1')).toEqual(false);
    expect(isHex('a')).toEqual(false);
    expect(isHex('0xabec')).toEqual(true);
    expect(isHex('0xabecg')).toEqual(false);
  });
});
