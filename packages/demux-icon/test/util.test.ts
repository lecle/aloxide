import { retry } from '../src/utils';

describe('test util file', () => {
  it('test retry function but do not retry', async () => {
    const res = await retry(() => new Promise((resolve, reject) => resolve(1)), 5, 500);
    expect(res).toEqual(1);
  });
  it('test retry function should retry', async () => {
    try {
      await retry(() => new Promise((resolve, reject) => reject('error')), 5, 500);
    } catch (error) {
      expect(error).toEqual('error');
    }
  });
});
