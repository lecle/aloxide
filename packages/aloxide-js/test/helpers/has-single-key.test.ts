import { checkSingleKey } from '../../src/helpers/has-single-key';

describe('test checkSingleKey', () => {
  it('should throw error when passing invalid input', () => {
    expect(() => {
      // @ts-ignore
      checkSingleKey();
    }).toThrowError('Invalid parameter.');
  });

  it('should throw error when passing more than 1 key object', () => {
    expect(() => {
      checkSingleKey({
        key1: 'key1',
        key2: 'key2',
        key3: 'key3',
      });
    }).toThrowError('Multiple keys are not support.');
  });

  it("should throw error when there's no input", () => {
    expect(() => {
      checkSingleKey({});
    }).toThrowError('Key must have 1 key-pair value.');
  });

  it('should return true when passing object has 1 key', () => {
    expect(
      checkSingleKey({
        key1: 'key1',
      }),
    ).toBe(true);
  });
});
