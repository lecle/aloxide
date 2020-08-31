import isBigNumber from '../src/isBigNumber';

describe('test is big number', () => {
  it('check 1598862518674351', () => {
    expect(isBigNumber('1598862518674351')).toEqual(false);
    expect(isBigNumber(1598862518674351)).toEqual(false);
  });
});
