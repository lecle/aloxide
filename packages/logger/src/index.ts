import chalk from 'chalk';
import { Logger } from './Logger';
export * from './Logger';

// tslint:disable:no-console
const log = (title, color = 'blue', ...p) => console.log(`${chalk[color].bold(title)} : ${chalk[color](...p)}`)

export function createLogger(
  {
    consoleLogger,
  }: {
    consoleLogger: boolean;
  } = {
    consoleLogger: false,
  },
): Logger {
  let logger: Logger;
  if (consoleLogger) {
    logger = {
      debug: (...p) => log('DEBUG', 'blue', ...p),
      info: (...p) => log('INFO', 'blue', ...p),
      warn: (...p) => log('WARNING', 'yellow', ...p),
      error: (...p) => log('ERROR', 'red', ...p),
      success: (...p) => log('SUCCESS', 'green', ...p),
    };
  } else {
    const nullLogger = (...p) => {};
    logger = {
      debug: nullLogger,
      info: nullLogger,
      warn: nullLogger,
      error: nullLogger,
      success: nullLogger,
    };
  }
  return logger;
}
