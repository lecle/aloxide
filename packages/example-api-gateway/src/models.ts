import { readAloxideConfig } from '@aloxide/abstraction';
import { DataProvider, indexStateSchema } from '@aloxide/demux';
import { ModelBuilder } from '@aloxide/model-sequelize';
import Logger from 'bunyan';
import { ModelAttributes, Op, Sequelize } from 'sequelize';

import config from './config';

const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);
const modelBuilder = new ModelBuilder({
  aloxideConfig,
  logger: Logger.createLogger({
    level: 'debug',
    name: 'models',
  }),
});

const indexStateSequelizeFields: ModelAttributes = ModelBuilder.mapField(
  modelBuilder.typeInterpreter,
  indexStateSchema.fields,
  indexStateSchema.key,
);

export function createDataProvider(
  sequelize: Sequelize,
  name: string,
  modelName: string,
  isIndexState?: boolean,
): DataProvider {
  const models = modelBuilder.build(sequelize);

  if (isIndexState) {
    models.push(sequelize.define(name, indexStateSequelizeFields));
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

    findAll({ first, after, last, before }, { entity: { key } }): Promise<any[]> {
      if (first)
        return m.findAll({
          limit: first,
          where: after && {
            [key]: {
              [Op.gt]: after,
            },
          },
          order: [[key, 'asc']],
        });

      if (last)
        return m.findAll({
          limit: last,
          where: before && {
            [key]: {
              [Op.lt]: before,
            },
          },
          order: [[key, 'desc']],
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
