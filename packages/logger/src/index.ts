import { Logger } from './Logger';

export { Logger } from './Logger';

export function createLogger({ consoleLogger } = { consoleLogger: false }): Logger {
  let createLog;

  if (consoleLogger) {
    const chalk = require('chalk');
    createLog = (level: string, color: string) => (...p) => console[level](chalk[color](...p));
  } else {
    createLog = () => () => {};
  }

  return {
    debug: createLog('debug', 'blue'),
    info: createLog('info', 'green'),
    warn: createLog('warn', 'yellow'),
    error: createLog('error', 'red'),
  };
}
