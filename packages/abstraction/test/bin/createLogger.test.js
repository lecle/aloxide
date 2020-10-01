const { createLogger } = require('../../bin/createLogger');

describe('createLogger', () => {
  it('create error level logger', () => {
    const spyDebug = jest.spyOn(global.console, 'debug').mockReturnValue();
    const spyError = jest.spyOn(global.console, 'error').mockReturnValue();

    const logger = createLogger({
      level: 'error',
    });

    const msg = 'eexx';
    logger.debug(msg);
    logger.error(msg);

    expect(spyDebug).not.toHaveBeenCalled();
    expect(spyError).toBeCalledTimes(1);
    expect(spyError).toBeCalledWith(msg);
  });
});
