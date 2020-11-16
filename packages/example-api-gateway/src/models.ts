import { readAloxideConfig } from '@aloxide/abstraction';
import { DataProvider, indexStateSchema } from '@aloxide/demux';
import { ModelBuilder } from '@aloxide/model-sequelize';
import Logger from 'bunyan';
import { ModelAttributes, Op, Sequelize, where } from 'sequelize';

import config from './config';

const UPDATE = 1;
const CREATE = 2;
const DELETE = 3;

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
  // get history Instance
  const history = models.find(model => model.name == 'History');

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

    async findBlockNumber(blockNumber: object): Promise<any> {
      return m.findAll({ where: { blockNumber } });
    },

    async updateOne(id, data) {
      return m.update(data, { where: { id } });
    },

    async deleteOne(id) {
      return m
        .destroy({
          where: { id },
        })
        .then(() => true);
    },

    async create(data: any, meta?: any): Promise<any> {
      await this.updateHistory(data, meta, CREATE);
      return m.create(data).then(() => data);
    },

    async update(data: any, metaData): Promise<any> {
      const {
        entity: { key },
      } = metaData;
      await this.updateHistory(data, metaData, UPDATE);
      return m.update(data, {
        where: {
          [key]: data[key],
        },
        logging: !isIndexState,
      });
    },

    async delete(id: any, meta?: any): Promise<boolean> {
      await this.updateHistory(id, meta, DELETE);
      return m
        .destroy({
          where: { id },
        })
        .then(() => true);
    },

    async updateHistory(data: any, meta?: any, type?: any): Promise<any> {
      if (m.tableName != 'is_eos') {
        try {
          let result;
          const currentBlockNumber = meta.blockInfo.blockNumber;
          switch (type) {
            case CREATE:
              await history.create({
                data: null,
                blockNumber: currentBlockNumber,
                entityName: m.name,
                entityId: data.id,
              });
              break;
            case UPDATE:
            case DELETE:
              result = await this.find(data.id || data);
              await history.create({
                data: JSON.stringify(result),
                blockNumber: currentBlockNumber,
                entityName: m.name,
                entityId: data.id,
              });
              break;
          }
          const lastIrreversibleBlockNumber = meta.blockInfo.lastIrreversibleBlockNumber;
          if (lastIrreversibleBlockNumber > currentBlockNumber) {
            try {
              // remove all history has blockNumber less than or equal to currentBlockNumber if the currentBlockNumber less than lastIrreversibleBlockNumber
              await history.destroy({
                where: { blockNumber: { [Op.lte]: currentBlockNumber } },
              });
            } catch (error) {
              // handle error here
            }
          }
        } catch (error) {
          // handle error here
        }
      }
      return;
    },
  };
}
