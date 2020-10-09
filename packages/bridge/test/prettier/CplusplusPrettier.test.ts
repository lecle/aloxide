import { CplusplusPrettier } from "../../src";

describe('CplusplusPrettier', () => {
  it('no error', () => {
    const p = new CplusplusPrettier();
    expect(p.format('ss', {})).toEqual('ss');
  });
});