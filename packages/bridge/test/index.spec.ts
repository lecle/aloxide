import { AbsTypeInterpreter, PythonPrettier } from "../src";

describe('test contract addaper', () => {
  it('should export PythonPrettier', () => {
    expect(PythonPrettier).toBeTruthy();
  });
  it('should export AbsTypeInterpreter', () => {
    expect(AbsTypeInterpreter).toBeTruthy();
  });
});
