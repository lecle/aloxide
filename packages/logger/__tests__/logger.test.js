'use strict';

const logger = require('..');

describe('logger', () => {
  it('should print a log', () => {
    const s = jest.spyOn(console, 'log');
    s.mockImplementation(() => {});

    logger.log('hello');
    expect(s).toBeCalledWith('hello');
  });

  it('should print a debug', () => {
    const s = jest.spyOn(console, 'debug');
    s.mockImplementation(() => {});

    logger.debug('hello');
    expect(s).toBeCalledWith('hello');
  });

  it('should print a info', () => {
    const s = jest.spyOn(console, 'info');
    s.mockImplementation(() => {});

    logger.info('hello');
    expect(s).toBeCalledWith('hello');
  });

  it('should print a warn', () => {
    const s = jest.spyOn(console, 'warn');
    s.mockImplementation(() => {});

    logger.warn('hello');
    expect(s).toBeCalledWith('hello');
  });

  it('should print a error', () => {
    const s = jest.spyOn(console, 'error');
    s.mockImplementation(() => {});

    logger.error('hello');
    expect(s).toBeCalledWith('hello');
  });
});
