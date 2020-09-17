import { jest } from '@jest/globals';

import { Logger } from '../src';

const logger: Logger = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

export default logger;
