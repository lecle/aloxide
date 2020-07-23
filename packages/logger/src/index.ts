import type { Logger } from './Logger';
export type { Logger } from './Logger';

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
      log: (...p) => console.log(...p),
      info: (...p) => console.info(...p),
      debug: (...p) => console.debug(...p),
      warn: (...p) => console.warn(...p),
      error: (...p) => console.error(...p),
    };
  } else {
    const nullLogger = (...p) => {};
    logger = {
      log: nullLogger,
      info: nullLogger,
      debug: nullLogger,
      warn: nullLogger,
      error: nullLogger,
    };
  }
  return logger;
}
