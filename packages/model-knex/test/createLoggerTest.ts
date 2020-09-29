import { jest } from '@jest/globals';
import Logger from 'bunyan';

const createLoggerTest = (): Logger => {
  const logger = Logger.createLogger({
    name: 'test',
    level: 'debug',
  });

  logger.info = jest.fn(() => true);
  logger.debug = jest.fn(() => true);
  logger.warn = jest.fn(() => true);
  logger.error = jest.fn(() => true);

  return logger;
};

export default createLoggerTest;
