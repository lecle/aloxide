import { ContractGenerator } from '../src';

describe('testing index exports', () => {
  it('create new instance of ContractGenerator without config', () => {
    expect(() => new ContractGenerator(null)).toThrowError('Missing configuration!');
  });
});
