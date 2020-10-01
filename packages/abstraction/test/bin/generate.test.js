/**
 * Note: there tests only run find after build
 */
jest.mock('../../bin/createLogger');
jest.mock('../../dist');

const path = require('path');
const { createLogger } = require('../../bin/createLogger');
const { ContractGenerator } = require('../../dist');
const { generate } = require('../../bin/generate');

describe('generate', () => {
  const generateF = jest.fn();
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    createLogger.mockReturnValue(mockLogger);
    ContractGenerator.mockReturnValue({
      generate: generateF,
    });
  });

  it('read config ', () => {
    const aloxideConfigPath = './test/bin/aloxide.yml';
    const options = {
      outputPath: '.',
    };

    expect(() => generate(aloxideConfigPath, options)).not.toThrowError();
    expect(ContractGenerator).toBeCalledTimes(1);
    expect(ContractGenerator).toBeCalledWith({
      adapters: undefined,
      aloxideConfigPath: path.resolve(process.cwd(), aloxideConfigPath),
      contractName: undefined,
      logDataOnly: undefined,
      logger: mockLogger,
      outputPath: path.resolve(process.cwd(), options.outputPath),
    });
    expect(generateF).toBeCalledTimes(1);
    expect(mockLogger.info).toBeCalledTimes(2);
  });

  it('print json', () => {
    const aloxideConfigPath = './test/bin/aloxide.yml';
    const options = {
      outputPath: '.',
      printConfig: 'json',
    };

    expect(() => generate(aloxideConfigPath, options)).not.toThrowError();
    expect(generateF).toBeCalledTimes(1);
    expect(mockLogger.info).toBeCalledTimes(3);
  });

  it('print pretty json', () => {
    const aloxideConfigPath = './test/bin/aloxide.yml';
    const options = {
      outputPath: '.',
      printConfig: 'pretty',
    };

    expect(() => generate(aloxideConfigPath, options)).not.toThrowError();
    expect(generateF).toBeCalledTimes(1);
    expect(mockLogger.info).toBeCalledTimes(3);
  });

  it('verbose', () => {
    const aloxideConfigPath = './test/bin/aloxide.yml';
    const options = {
      outputPath: '.',
      verbose: true,
    };

    expect(() => generate(aloxideConfigPath, options)).not.toThrowError();
    expect(generateF).toBeCalledTimes(1);
    expect(mockLogger.info).toBeCalledTimes(2);
  });
});
