import path from 'path';
import { EntityConfig, ModelContractAdapter } from '../src';

describe('test Model Contract Adapter', () => {
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
  const entity = [
    {
      name: 'Poll',
      attributes: [
        { name: 'id', type: 'DataTypes.INTEGER', primaryKey: true },
        { name: 'name', type: 'DataTypes.STRING', primaryKey: false },
        { name: 'body', type: 'DataTypes.STRING', primaryKey: false },
      ],
    },
    {
      name: 'Vote',
      attributes: [
        { name: 'id', type: 'DataTypes.INTEGER', primaryKey: true },
        { name: 'pollId', type: 'DataTypes.INTEGER', primaryKey: false },
        { name: 'ownerId', type: 'DataTypes.INTEGER', primaryKey: false },
        { name: 'point', type: 'DataTypes.DOUBLE', primaryKey: false },
      ],
    },
  ];
  describe('test function generateFromTemplate ', () => {
    const outputPath = path.resolve(__dirname, '../out');
    it('should generate templete successful', () => {
      const adapter = new ModelContractAdapter();
      const templatePath = path.resolve('../bridge/smart-contract-templates');
      adapter.templatePath = templatePath;
      adapter.outputPath = outputPath;

      const translateEntityConfigsMock = jest
        .spyOn(adapter, 'translateEntityConfigs')
        .mockReturnValueOnce(entity as any);
      adapter.generateFromTemplate();
      expect(translateEntityConfigsMock).toBeCalledTimes(1);
    });
  });
  describe('test function translateEntityConfigs ', () => {
    it('should translateEntityConfigs successful', () => {
      const adapter = new ModelContractAdapter();
      adapter.entityConfigs = entityConfigs;
      const result = adapter.translateEntityConfigs();
      expect(result).toEqual(entity);
    });
  });
});
