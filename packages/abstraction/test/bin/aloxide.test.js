jest.mock('commander');
jest.mock('../../bin/createLogger');
const { logger } = require('../../bin/createLogger');
const program = require('commander');

describe('aloxide', () => {
  program.storeOptionsAsProperties.mockReturnThis();
  program.passCommandToAction.mockReturnThis();
  program.allowUnknownOption.mockReturnThis();
  program.option.mockReturnThis();
  program.command.mockReturnThis();

  it('setup', () => {
    const aloxide = require('../../bin/aloxide');
    expect(aloxide).toBeTruthy();
    expect(program.action).toBeCalledTimes(1);
    expect(program.parse).toBeCalledTimes(1);
    expect(logger.debug).toBeCalledTimes(1);
    expect(logger.debug).toBeCalledWith('use adapter', 'eos');
  });
});
