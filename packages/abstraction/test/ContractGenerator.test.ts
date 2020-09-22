import { ContractGenerator } from '@aloxide/abstraction';
import { EOSContractAdapter, ICONContractAdapter, ModelContractAdapter } from '@aloxide/bridge';
import path from 'path';

import createLoggerTest from './createLoggerTest';

describe('test ContractGenerator', () => {
  describe('ContractGenerator creation', () => {
    const outputPath = __dirname;

    it('should throw error when creating without config', () => {
      // @ts-ignore
      expect(() => {
        return new ContractGenerator(null);
      }).toThrowError('Missing configuration!');
    });

    it('should throw error if Aloxide config is missing', () => {
      const logger = createLoggerTest();
      expect(() => {
        // @ts-ignore
        return new ContractGenerator({
          logger,
          adapters: new EOSContractAdapter(),
          resultPath: outputPath,
        });
      }).toThrowError('Invalid Aloxide config: missing aloxideConfigPath');
    });

    it('should throw error if Aloxide config is invalid', () => {
      const logger = createLoggerTest();
      expect(() => {
        return new ContractGenerator({
          logger,
          adapters: new EOSContractAdapter(),
          resultPath: outputPath,
          aloxideConfigPath: path.resolve(outputPath, './invalid_aloxide.yml'),
        });
      }).toThrowError('Invalid Aloxide config: Input entities mismatch!');
    });

    it('should throw error when missing "resultPath" config', () => {
      const logger = createLoggerTest();
      expect(() => {
        // @ts-ignore
        return new ContractGenerator({
          logger,
          adapters: new EOSContractAdapter(),
          aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
        });
      }).toThrowError('Missing "resultPath"!');
    });

    it('should throw error when adding invalid adapter', () => {
      const logger = createLoggerTest();
      expect(() => {
        return new ContractGenerator({
          resultPath: outputPath,
          // @ts-ignore
          adapters: 'invalid adapter config',
          aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
          logger,
        });
      }).toThrowError('Invalid Contract Adapter');
    });

    it('should allow to add multi adapters on initialization', () => {
      const logger = createLoggerTest();
      expect(() => {
        return new ContractGenerator({
          logger,
          resultPath: outputPath,
          adapters: [new EOSContractAdapter(), new ICONContractAdapter()],
          aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
        });
      }).not.toThrowError();
    });

    it('should call generate function of every input adapter', () => {
      const adapter1 = new EOSContractAdapter();
      adapter1.generate = jest.fn();

      const adapter2 = new ICONContractAdapter();
      adapter2.generate = jest.fn();

      const adapter3 = new ModelContractAdapter();
      adapter3.generate = jest.fn();

      const logger = createLoggerTest();
      const generator = new ContractGenerator({
        logger,
        adapters: [adapter1, adapter2, adapter3],
        resultPath: outputPath,
        aloxideConfigPath: path.resolve(__dirname, './aloxide.yml'),
      });

      generator.generate();

      expect(adapter1.generate).toBeCalledWith(outputPath);
      expect(adapter2.generate).toBeCalledWith(outputPath);
      expect(adapter3.generate).toBeCalledWith(outputPath);
    });
  });

  describe('addAdapters()', () => {
    const outputPath = __dirname;

    it('should allow to add adapter', () => {
      const logger = createLoggerTest();
      const generator = new ContractGenerator({
        logger,
        resultPath: outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      });

      expect(() => {
        generator.addAdapters(new EOSContractAdapter());
      }).not.toThrowError();
    });

    it('should allow to add multi adapters at once', () => {
      const logger = createLoggerTest();
      const generator = new ContractGenerator({
        logger,
        resultPath: outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      });

      expect(() => {
        generator.addAdapters([new EOSContractAdapter(), new ICONContractAdapter()]);
      }).not.toThrowError();
    });
  });
});
