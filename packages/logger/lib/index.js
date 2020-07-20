'use strict';

module.exports.createLogger = function () {
  return {
    log: (...p) => console.log(...p),
    info: (...p) => console.info(...p),
    debug: (...p) => console.debug(...p),
    warn: (...p) => console.warn(...p),
    error: (...p) => console.error(...p),
  };
};
