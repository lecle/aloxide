import { DataProvider } from '@aloxide/demux';
import { ModelBuilder } from '@aloxide/model';
import Logger from 'bunyan';
import { DataTypes, ModelAttributes, Op, Sequelize } from 'sequelize';

import config from './config';

const indexStateSchema: ModelAttributes = {
  blockNumber: {
    type: DataTypes.INTEGER,
  },
  blockHash: {
    type: DataTypes.STRING,
  },
  isReplay: {
    type: DataTypes.BOOLEAN,
  },
  handlerVersionName: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
};

const modelBuilder = new ModelBuilder({
  aloxideConfigPath: config.aloxideConfigPath,
  logger: Logger.createLogger({
    level: 'debug',
    name: 'models',
  }),
});

export function createDataProvider(
  sequelize: Sequelize,
  name: string,
  modelName: string,
  isIndexState?: boolean,
): DataProvider {
  const models = modelBuilder.build(sequelize);

  if (isIndexState) {
    models.push(sequelize.define(name, indexStateSchema));
  }

  const m = models.find(model => model.name == modelName);

  if (!m) {
    const errMsg = `Missing of entity name [${name}], modelName [${modelName}]`;
    config.logger.error(errMsg);
    throw new Error(errMsg);
  }

  return {
    name,
    setup: async () => {
      if (isIndexState) {
        return sequelize
          .sync({
            logging: false,
          })
          .then(() => {});
      }
    },

    count(): Promise<number> {
      return m.count();
    },

    findAll({ limit, after }, { entity: { key } }): Promise<any[]> {
      return m.findAll({
        limit,
        where: after && {
          [key]: {
            [Op.gt]: after,
          },
        },
      });
    },

    find(id: any, meta?: any): Promise<any> {
      return m.findByPk(id, { raw: true });
    },

    create(data: any, meta?: any): Promise<any> {
      return m.create(data).then(() => data);
    },

    update(data: any, { entity: { key } }): Promise<any> {
      return m.update(data, {
        where: {
          [key]: data[key],
        },
        logging: !isIndexState,
      });
    },

    delete(id: any, meta?: any): Promise<boolean> {
      return m.destroy(id).then(() => true);
    },
  };
}
