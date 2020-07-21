import path from 'path';

import { AloxideConfig, ContractGenerator, ContractGeneratorConfig } from '../src';

describe('test ContractGenerator', () => {
  describe('test read aloxide configuration', () => {
    const config: ContractGeneratorConfig = {
      adapter: null,
      aloxideConfigPath: null,
      resultPath: null,
      logger: {
        info: jest.fn(),
        debug: jest.fn(),
      },
    };

    const sampleAloxideConfig: AloxideConfig = {
      entities: [
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
      ],
    };

    it('should throw error if there aloxide configration path is not provided', () => {
      expect(() => new ContractGenerator(config)).toThrowError('missing aloxideConfigPath');
    });

    it('should throw error when was given none existing path', () => {
      const aloxideConfigPath = path.resolve(__dirname, 'none-existing-aloxide.json');
      expect(
        () => new ContractGenerator(Object.assign(config, { aloxideConfigPath })),
      ).toThrowError(`file [${aloxideConfigPath}] does not exist`);
    });

    it('should throw error when given file with unsupported extention', () => {
      const aloxideConfigPath = path.resolve(__dirname, './aloxide.jsonx');
      expect(
        () => new ContractGenerator(Object.assign(config, { aloxideConfigPath })),
      ).toThrowError(`unknow file extention of file: [${aloxideConfigPath}]`);
    });

    it('should load aloxide.yml', () => {
      const aloxideConfigPath = path.resolve(__dirname, './aloxide.yml');
      const generator = new ContractGenerator(Object.assign(config, { aloxideConfigPath }));
      expect(config.logger.debug).toBeCalledWith('parsing aloxide config with YAML format');
      expect(generator.aloxideConfig).toEqual(sampleAloxideConfig);
    });

    it('should load aloxide.yaml', () => {
      const aloxideConfigPath = path.resolve(__dirname, './aloxide.yaml');
      const generator = new ContractGenerator(Object.assign(config, { aloxideConfigPath }));
      expect(config.logger.debug).toBeCalledWith('parsing aloxide config with YAML format');
      expect(generator.aloxideConfig).toEqual(sampleAloxideConfig);
    });

    it('should load aloxide.json', () => {
      const aloxideConfigPath = path.resolve(__dirname, './aloxide.json');
      const generator = new ContractGenerator(Object.assign(config, { aloxideConfigPath }));
      expect(config.logger.debug).toBeCalledWith('parsing aloxide config with JSON format');
      expect(generator.aloxideConfig).toEqual(sampleAloxideConfig);
    });
  });
});
