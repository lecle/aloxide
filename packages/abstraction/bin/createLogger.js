function createLogger({ level }) {
  const levels = ['debug', 'info', 'warn', 'error'];
  const l = levels.indexOf(level);
  const nullLog = () => {};

  return levels
    .map((s, i) => ({
      s,
      e: i >= l,
    }))
    .reduce((a, c) => Object.assign(a, { [c.s]: c.e ? console[c.s] : nullLog }), {});
}

const logger = createLogger({
  level: 'debug',
});

module.exports = {
  createLogger,
  logger,
};
