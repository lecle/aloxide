import hexToNumber, { hexPropToNumber } from '../src/hexToNumber';

describe('hex to number', () => {
  it('check whether it is hex', () => {
    expect(hexToNumber('0x1234abcde')).toEqual(4887067870);
    expect(hexToNumber('0xabcd')).toEqual(43981);
    expect(hexToNumber('0x124ee')).toEqual(74990);
  });

  it('convert hex-prop of object to number', () => {
    expect(hexPropToNumber(null)).toBeNull();
    expect(hexPropToNumber(undefined)).toBeUndefined();
    expect(
      hexPropToNumber({
        a: '0xabcd',
        b: 'abcd',
        e: '0x124ee',
        f: {
          a: '0xabcd',
          b: 'abcd',
          e: '0x124ee',
          g: {
            f: {
              a: '0xabcd',
              b: 'abcd',
              e: '0x124ee',
            },
          },
        },
      }),
    ).toEqual({
      a: 43981,
      b: 'abcd',
      e: 74990,
      f: { a: 43981, b: 'abcd', e: 74990, g: { f: { a: 43981, b: 'abcd', e: 74990 } } },
    });
  });
});
