import { ContractGenerator, readAloxideConfig } from '../src';

describe('testing index exports', () => {
  it('create new instance of ContractGenerator without config', () => {
    expect(() => new ContractGenerator(null)).toThrowError('Missing configuration!');
  });

  it('export readAloxideConfig', () => {
    expect(typeof readAloxideConfig).toEqual('function');
  });
});
