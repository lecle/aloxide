import { AloxideConfig } from '@aloxide/abstraction';
import path from 'path';
import { Sequelize } from 'sequelize';

import { ModelBuilder } from '../src/ModelBuilder';

describe('model', () => {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
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

  it('shoudl build model', () => {
    const aloxideConfigPath = path.resolve(__dirname, './aloxide.yml');
    const modelBuilder = new ModelBuilder({
      aloxideConfigPath,
      logger,
    });

    expect(modelBuilder.aloxideConfig).toEqual(sampleAloxideConfig);

    const sequelize = new Sequelize('sqlite::memory:');
    const models = modelBuilder.build(sequelize);
    expect(models.length).toEqual(2);
    expect(sequelize.models.Poll).toBeTruthy();
    expect(sequelize.models.Vote).toBeTruthy();
  });
});
