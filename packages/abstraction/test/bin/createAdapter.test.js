jest.mock('../../bin/createLogger');

const { EOSContractAdapter, ICONContractAdapter } = require('@aloxide/bridge');
const { createAdapter } = require('../../bin/createAdapter');

describe('createAdapter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ceate adapter', () => {
    expect(createAdapter('eos')).toEqual(expect.arrayContaining([expect.any(EOSContractAdapter)]));

    expect(createAdapter('can')).toEqual(expect.arrayContaining([expect.any(EOSContractAdapter)]));

    expect(createAdapter('icon')).toEqual(
      expect.arrayContaining([expect.any(ICONContractAdapter)]),
    );
  });

  it('unknow adapter', () => {
    const a = 'etherium';
    const msg = `unknown adapter ${a}`;
    expect(() => createAdapter(a)).toThrow(msg);
  });
});
