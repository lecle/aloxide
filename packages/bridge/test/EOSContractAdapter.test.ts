import path from 'path';

import { EntityConfig, EOSContractAdapter } from '../src';

describe('test EOS contract addapter', () => {
  const blockchain = 'eos';
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
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };

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

      expect(spyGenerateFromTemplate).toBeCalledTimes(1);
    });
  });
  describe('test generateFromTemplate', () => {
    it('should update templatePath to specific blockchain', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'test-path';
      adapter.templatePath = templatePath;

      const createTables = jest.spyOn(adapter, 'createTables');
      createTables.mockImplementation(jest.fn());

      const createActions = jest.spyOn(adapter, 'createActions');
      createActions.mockImplementation(jest.fn());

      const spyGenerateCpp = jest.spyOn(adapter, 'generateCpp');
      spyGenerateCpp.mockImplementation(jest.fn());

      const spyGenerateHpp = jest.spyOn(adapter, 'generateHpp');
      spyGenerateHpp.mockImplementation(jest.fn());

      adapter.generateFromTemplate();
      expect(adapter.templatePath).toEqual(path.resolve(templatePath, blockchain));

      expect(createActions).toBeCalledTimes(1);
      expect(createActions).toBeCalledTimes(1);
      expect(spyGenerateCpp).toBeCalledTimes(1);
      expect(spyGenerateHpp).toBeCalledTimes(1);
    });
  });
});
