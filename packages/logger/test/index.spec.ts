import chalk from 'chalk';

import { createLogger, Logger } from '../src';

describe('logger', () => {
  const logger: Logger = createLogger({
    consoleLogger: true,
  });

  it('should print a debug', () => {
    const s = jest.spyOn(console, 'debug');
    s.mockImplementation(() => {});

    logger.debug('hello');
    expect(s).toBeCalledWith(chalk.blue('hello'));
  });

  it('should print a info', () => {
    const s = jest.spyOn(console, 'info');
    s.mockImplementation(() => {});

    logger.info('hello');
    expect(s).toBeCalledWith(chalk.green('hello'));
  });

  it('should print a warn', () => {
    const s = jest.spyOn(console, 'warn');
    s.mockImplementation(() => {});

    logger.warn('hello');
    expect(s).toBeCalledWith(chalk.yellow('hello'));
  });

  it('should print an error', () => {
    const s = jest.spyOn(console, 'error');
    s.mockImplementation(() => {});

    logger.error('hello');
    expect(s).toBeCalledWith(chalk.red('hello'));
  });
});

describe('create a null logger', () => {
  it('creat a null logger', () => {
    const logger: Logger = createLogger({
      consoleLogger: false,
    });
    expect(logger.debug).toEqual(expect.any(Function));
  });

  it('creat a null logger when no param is passed', () => {
    const logger: Logger = createLogger();
    expect(logger.debug).toEqual(expect.any(Function));
  });
});
