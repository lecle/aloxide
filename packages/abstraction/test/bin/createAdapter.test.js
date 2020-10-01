jest.mock('../../bin/createLogger');

const { EOSContractAdapter, ICONContractAdapter } = require('@aloxide/bridge');
const { createAdapter } = require('../../bin/createAdapter');
const { logger } = require('../../bin/createLogger');

describe('createAdapter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ceate adapter', () => {
    expect(createAdapter('eos')).toEqual(expect.arrayContaining([expect.any(EOSContractAdapter)]));
    expect(logger.debug).toBeCalledWith('use adapter', 'eos');

    expect(createAdapter('can')).toEqual(expect.arrayContaining([expect.any(EOSContractAdapter)]));
    expect(logger.debug).toBeCalledWith('use adapter', 'can');

    expect(createAdapter('icon')).toEqual(
      expect.arrayContaining([expect.any(ICONContractAdapter)]),
    );
    expect(logger.debug).toBeCalledWith('use adapter', 'icon');
  });

  it('unknow adapter', () => {
    const a = 'etherium';
    const msg = `unknown adapter ${a}`;
    expect(() => createAdapter(a)).toThrow(msg);
  });
});
