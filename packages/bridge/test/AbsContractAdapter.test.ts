import path from 'path';

import { AbsContractAdapter } from '../src';
import createLoggerTest from './createLoggerTest';

class TestAdapterClass extends AbsContractAdapter {
  generateFromTemplate() {
    throw new Error('Method not implemented.');
  }
}

describe('AbsContractAdapter', () => {
  describe('constructor', () => {
    it('create instance of contract adapter', () => {
      const a = new TestAdapterClass();
      a.logger = createLoggerTest();
      expect(a.config).toEqual({});
    });
  });

  describe('generate', () => {
    it('call generateFromTemplate', () => {
      const a = new TestAdapterClass({
        blockchainType: 'test',
      });
      a.logger = createLoggerTest();

      const spyGenerateFromTemplate = jest.spyOn(a, 'generateFromTemplate').mockReturnValue();

      a.generate('out');
      expect(a.templatePath).toEqual(
        path.resolve(
          path.dirname(require.resolve('@aloxide/bridge')),
          '../smart-contract-templates',
        ),
      );
      expect(a.outputPath).toEqual(path.resolve('out', a.blockchainType));
      expect(a.logger.debug).toBeCalledTimes(1);
      expect(spyGenerateFromTemplate).toBeCalledTimes(1);
    });

    it('config.outputPath is an absolute path', () => {
      const a = new TestAdapterClass({
        blockchainType: 'test',
        outputPath: '/hello-smart-contract',
      });
      a.logger = createLoggerTest();

      const spyGenerateFromTemplate = jest.spyOn(a, 'generateFromTemplate').mockReturnValue();

      expect(() => a.generate('out')).not.toThrowError();
      expect(a.templatePath).toEqual(
        path.resolve(
          path.dirname(require.resolve('@aloxide/bridge')),
          '../smart-contract-templates',
        ),
      );
      expect(a.outputPath).toEqual('/hello-smart-contract');
      expect(spyGenerateFromTemplate).toBeCalledTimes(1);
    });

    it('config.outputPath is a relative path', () => {
      const a = new TestAdapterClass({
        blockchainType: 'test',
        outputPath: 'hello-smart-contract',
      });
      a.logger = createLoggerTest();

      const spyGenerateFromTemplate = jest.spyOn(a, 'generateFromTemplate').mockReturnValue();

      expect(() => a.generate('out')).not.toThrowError();
      expect(a.templatePath).toEqual(
        path.resolve(
          path.dirname(require.resolve('@aloxide/bridge')),
          '../smart-contract-templates',
        ),
      );

      expect(a.outputPath).toEqual(path.resolve('out', 'hello-smart-contract'));
      expect(spyGenerateFromTemplate).toBeCalledTimes(1);
    });
  });
});
