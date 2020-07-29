import fs from 'fs';
import path from 'path';

import { EntityConfig, ICONContractAdapter } from '../src';

describe('test ICON contract addapter', () => {
  const blockchain = 'icon';
  const entityConfigs: EntityConfig[] = [
    {
      fields: [
        { name: 'id', type: 'uint64_t' },
        { name: 'name', type: 'string' },
        { name: 'body', type: 'string' },
      ],
      key: 'id',
      name: 'Poll',
    },
    {
      fields: [
        { name: 'id', type: 'uint64_t' },
        { name: 'pollId', type: 'uint64_t' },
        { name: 'ownerId', type: 'uint64_t' },
        { name: 'point', type: 'number' },
      ],
      key: 'id',
      name: 'Vote',
    },
  ];

  describe('test generate', () => {
    const outputPath = path.resolve(__dirname, '../out');

    it('should call generateFromTemplate', () => {
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        log: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
      };

      const spyExistsSync = jest.spyOn(fs, 'existsSync');
      spyExistsSync.mockReturnValueOnce(false);

      const spyMkdirSync = jest.spyOn(fs, 'mkdirSync');
      spyMkdirSync.mockImplementation(jest.fn());

      const spyGenerateFromTemplate = jest.spyOn(adapter, 'generateFromTemplate');
      spyGenerateFromTemplate.mockImplementation(jest.fn());

      adapter.generate(outputPath);
      expect(adapter.logger.debug).toBeCalledWith(
        `output path is: ${outputPath}, blockchain type: ${blockchain}`,
      );

      expect(adapter.templatePath).toEqual(
        path.resolve(
          path.dirname(require.resolve('@aloxide/bridge')),
          '../smart-contract-templates',
        ),
      );

      expect(adapter.outputPath).toEqual(path.resolve(outputPath, blockchain));

      expect(spyExistsSync).toBeCalledWith(adapter.outputPath);

      expect(spyMkdirSync).toBeCalledWith(adapter.outputPath, { recursive: true });
      expect(adapter.logger.debug).toBeCalledWith(`make directory: ${adapter.outputPath}`);

      expect(spyGenerateFromTemplate).toBeCalledTimes(1);
    });
  });
  describe('test generateFromTemplate', () => {
    it('should update templatePath to specific blockchain', () => {
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        log: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'test-path';
      adapter.templatePath = templatePath;

      const spyGenerateInit = jest.spyOn(adapter, 'generateInit');
      spyGenerateInit.mockImplementation(jest.fn());

      const spyGeneratePackage = jest.spyOn(adapter, 'generatePackage');
      spyGeneratePackage.mockImplementation(jest.fn());

      const spyGenerateMainPy= jest.spyOn(adapter, 'generateMainPy');
      spyGenerateMainPy.mockImplementation(jest.fn());
  
      const spyGenerateCallAPI= jest.spyOn(adapter, 'generateCallAPI');
      spyGenerateCallAPI.mockImplementation(jest.fn());

      const spyGenerateTXAPI= jest.spyOn(adapter, 'generateTXAPI');
      spyGenerateTXAPI.mockImplementation(jest.fn());
      
      adapter.generateFromTemplate();
      expect(adapter.templatePath).toEqual(path.resolve(templatePath, blockchain));

      expect(spyGenerateInit).toBeCalledTimes(1);
      expect(spyGeneratePackage).toBeCalledTimes(1);
      expect(spyGenerateMainPy).toBeCalledTimes(1);
      expect(spyGenerateCallAPI).toBeCalledTimes(1);
      expect(spyGenerateTXAPI).toBeCalledTimes(1);
    });
  });
});
