import BigNumber from 'bignumber.js';
import { toNumber } from '../src/toNumber';

describe('test to number', () => {
  it('convert 1598862518674351 to number', () => {
    const n = toNumber('1598862518674351');
    expect(n).toEqual(1598862518674351);

    const n2 = toNumber(1598862518674351);
    expect(n2).toEqual(n);
  });

  fit('Should be a bignumber', () => {
    const n = toNumber(new BigNumber('823456789123456.2'));
    expect(n).toEqual(823456789123456.2);
  });
});
