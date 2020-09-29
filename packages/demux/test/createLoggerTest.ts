import { jest } from '@jest/globals';

import { Logger } from '../src';

const createLoggerTest = (): Logger => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});

export default createLoggerTest;
