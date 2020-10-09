import path from 'path';

import { EOSContractAdapter, ICONContractAdapter } from '../../bridge/src';
import { ContractGeneratorConfig } from '../src';
import { ContractGenerator } from '../src/ContractGenerator';
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

    it('should use console as default logger', () => {
      jest.spyOn(console, 'debug').mockImplementation(jest.fn());

      const c = new ContractGenerator({
        adapters: new EOSContractAdapter(),
        outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      });
      expect(c.logger).toEqual(console);
    });

    it('should throw error if Aloxide config is missing', () => {
      const logger = createLoggerTest();
      expect(() => {
        // @ts-ignore
        return new ContractGenerator({
          logger,
          adapters: new EOSContractAdapter(),
          outputPath,
        });
      }).toThrowError('Invalid Aloxide config: missing aloxideConfigPath');
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
      }).toThrowError('Missing "outputPath"!');
    });

    it('should allow to add multi adapters on initialization', () => {
      const logger = createLoggerTest();
      expect(() => {
        return new ContractGenerator({
          logger,
          outputPath,
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

      const logger = createLoggerTest();
      const generator = new ContractGenerator({
        logger,
        adapters: [adapter1, adapter2],
        outputPath,
        aloxideConfigPath: path.resolve(__dirname, './aloxide.yml'),
      });

      generator.generate();

      expect(adapter1.generate).toBeCalledWith(outputPath);
      expect(adapter2.generate).toBeCalledWith(outputPath);
    });
  });

  describe('addAdapters()', () => {
    const outputPath = __dirname;

    it('should allow to add adapter', () => {
      const logger = createLoggerTest();
      const generator = new ContractGenerator({
        logger,
        outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      });

      expect(() => {
        generator.addAdapters(new EOSContractAdapter());
      }).not.toThrowError();

      expect(() => {
        generator.addAdapters([new EOSContractAdapter()]);
      }).not.toThrowError();
    });

    it('should allow to add multi adapters at once', () => {
      const logger = createLoggerTest();
      const generator = new ContractGenerator({
        logger,
        outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      });

      expect(() => {
        generator.addAdapters([new EOSContractAdapter(), new ICONContractAdapter()]);
      }).not.toThrowError();
    });
  });

  describe('configure adapter', () => {
    const outputPath = __dirname;

    beforeEach(() => {
      jest.spyOn(console, 'debug').mockImplementation(jest.fn());
    });

    it('default value', () => {
      const config: ContractGeneratorConfig = {
        outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      };

      const generator = new ContractGenerator(config);
      const adapter = new EOSContractAdapter();
      const configuredAdapter = generator.configureAdapter(adapter);

      expect(configuredAdapter.logger).toEqual(adapter.logger);
      expect(configuredAdapter.contractName).toEqual('hello');
      expect(configuredAdapter.entityConfigs).toEqual(generator.aloxideConfig.entities);
      expect(configuredAdapter.logDataOnly).toEqual(false);
    });

    it('configure adapter with contract name', () => {
      const config: ContractGeneratorConfig = {
        outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
        contractName: 'ee1',
      };

      const generator = new ContractGenerator(config);
      const adapter = new EOSContractAdapter();
      const configuredAdapter = generator.configureAdapter(adapter);

      expect(configuredAdapter.contractName).toEqual(config.contractName);
    });

    describe('config logDataOnly', () => {
      const config: ContractGeneratorConfig = {
        outputPath,
        aloxideConfigPath: path.resolve(outputPath, './aloxide.yml'),
      };

      it('adapter.logDataOnly is not null', () => {
        const generator = new ContractGenerator(config);
        const adapter = new EOSContractAdapter();
        adapter.logDataOnly = false;
        const configuredAdapter = generator.configureAdapter(adapter);

        expect(configuredAdapter.logDataOnly).toEqual(false);
      });

      it('adapter.logDataOnly is null and undefined logDataOnly', () => {
        const generator = new ContractGenerator(config);
        const adapter = new EOSContractAdapter();
        const configuredAdapter = generator.configureAdapter(adapter);
        expect(configuredAdapter.logDataOnly).toEqual(false);
      });

      it('adapter.logDataOnly is null and logDataOnly is false', () => {
        config.logDataOnly = false;
        const generator = new ContractGenerator(config);
        const adapter = new EOSContractAdapter();
        const configuredAdapter = generator.configureAdapter(adapter);
        expect(configuredAdapter.logDataOnly).toEqual(config.logDataOnly);
      });

      it('adapter.logDataOnly is null and logDataOnly is true', () => {
        config.logDataOnly = true;
        const generator = new ContractGenerator(config);
        const adapter = new EOSContractAdapter();
        const configuredAdapter = generator.configureAdapter(adapter);
        expect(configuredAdapter.logDataOnly).toEqual(config.logDataOnly);
      });
    });
  });
});
