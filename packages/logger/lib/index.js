'use strict';

function Logger() {
  this.log = (...p) => console.log(...p);
  this.info = (...p) => console.info(...p);
  this.debug = (...p) => console.debug(...p);
  this.warn = (...p) => console.warn(...p);
  this.error = (...p) => console.error(...p);
  return this;
}

const logger = new Logger();

module.exports = logger;
