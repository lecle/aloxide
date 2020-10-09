import { PythonPrettier } from "../../src";

describe('PythonPrettier', () => {
  it('no error', () => {
    const p = new PythonPrettier();
    expect(p.format('ss', {})).toEqual('ss');
  });
});