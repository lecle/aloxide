import { DataProvider } from '@aloxide/demux';
import { ModelBuilder } from '@aloxide/model';
import Logger from 'bunyan';
import { DataTypes } from 'sequelize';

import config from './config';

const modelBuilder = new ModelBuilder({
  aloxideConfigPath: config.aloxideConfigPath,
  logger: Logger.createLogger({
    level: 'debug',
    name: 'models',
  }),
});

const sequelize = config.sequelize;

const models = modelBuilder.build(sequelize);

const indexStateSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1,
  },
  blockNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  blockHash: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isReplay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  handlerVersionName: {
    type: DataTypes.STRING,
    defaultValue: this.handlerVersionName,
  },
};

models.push(sequelize.define('DemuxIndexState_eos', indexStateSchema));
models.push(sequelize.define('DemuxIndexState_icon', indexStateSchema));

function createDataProvider(name: string, modelName: string): DataProvider {
  const m = models.find(model => model.name == modelName);

  return {
    name,
    setup: async () => {
      if (name.startsWith('DemuxIndexState_')) {
        return sequelize.sync().then(() => {});
      }
    },

    find(id: any, meta?: any): Promise<any> {
      return m.findByPk(id);
    },

    create(data: any, meta?: any): Promise<any> {
      return m.create(data);
    },

    update(data: any, { entity: { key } }): Promise<any> {
      return m.update(data, {
        where: {
          [key]: data[key],
        },
      });
    },

    delete(id: any, meta?: any): Promise<boolean> {
      return m.destroy(id).then(() => true);
    },
  };
}

export const Poll: DataProvider = createDataProvider('Poll', 'Poll');
export const Vote: DataProvider = createDataProvider('Vote', 'Voll');
export const DemuxIndexState_eos: DataProvider = createDataProvider(
  'DemuxIndexState_eos',
  'DemuxIndexState_eos',
);
export const DemuxIndexState_icon: DataProvider = createDataProvider(
  'DemuxIndexState_icon',
  'DemuxIndexState_icon',
);
