const path = require('path');
const { readAloxideConfig } = require('@aloxide/abstraction');
const { createWatcher, indexStateSchema, AloxideDataManager } = require('@aloxide/demux');
const { ModelBuilder } = require('@aloxide/model-sequelize');
const Logger = require('bunyan');
const Sequelize = require('sequelize');
const { IconActionReader } = require('@aloxide/demux-icon');

global.logger = Logger.createLogger({
  name: 'example-demux',
  level: 'info',
  src: false,
});

const aloxideConfig = readAloxideConfig(path.resolve('./aloxide.yml'), logger);

indexStateSchema.name = 'DemuxIndexState_ICON';
aloxideConfig.entities.push(indexStateSchema);

const modelBuilder = new ModelBuilder({
  aloxideConfig,
  logger,
});

/**
 * We handle many databases here
 */
const db = [
  { dbType: 'postgres', enable: true },
  { dbType: 'mysql', enable: true },
  { dbType: 'memory', enable: true },
]; // TODO add more database type

const dbModels = db
  .filter(({ enable }) => enable)
  .map(({ dbType }) => {
    let s;
    const options = {
      logging: msg => logger.debug(msg),
    };

    switch (dbType) {
      case 'memory':
        s = new Sequelize('sqlite::memory:', options);
        break;
      case 'postgres':
        s = new Sequelize('postgres://aloxide:localhost-pw2020@localhost:5432/aloxide', options);
        break;
      case 'mysql':
        s = new Sequelize('mysql://root:localhost-pw2020@localhost:3306/aloxide', options);
        break;
    }

    return {
      dbType,
      sequelize: s,
      models: s && modelBuilder.build(s),
    };
  })
  .filter(({ sequelize }) => !!sequelize);

const defaultOrm = dbModels[0];

if (!defaultOrm) {
  throw new Error('There is no database');
}

function getModel(models, name) {
  return models.find(m => m.name == name);
}

const dataProviders = ['Poll', 'Option', 'Vote', indexStateSchema.name].map(name => {
  const isIndexState = name == indexStateSchema.name;

  return {
    name,
    setup() {
      if (isIndexState) {
        return Promise.all(
          dbModels.map(({ sequelize }) =>
            sequelize.authenticate().then(() =>
              sequelize.sync({
                force: true,
              }),
            ),
          ),
        );
      }
      return Promise.resolve();
    },

    count() {
      return getModel(defaultOrm.models, name).count();
    },

    findAll() {
      return getModel(defaultOrm.models, name).findAll();
    },

    find(id) {
      return getModel(defaultOrm.models, name).findByPk(id, { raw: true });
    },

    create(data) {
      return Promise.all(
        dbModels.map(({ models }) => {
          const model = getModel(models, name);
          return model.create(data);
        }),
      ).then(() => data);
    },

    update(data, meta) {
      const key = meta.entity.key;

      return Promise.all(
        dbModels.map(({ models }) => {
          const model = getModel(models, name);
          return model.update(data, {
            where: {
              [key]: data[key],
            },
            logging: !isIndexState,
          });
        }),
      ).then(() => data);
    },

    delete(id) {
      return Promise.all(
        dbModels.map(({ models }) => {
          const model = getModel(models, name);
          return model.destroy(id);
        }),
      ).then(() => true);
    },
  };
});

/**
 * required data provider
 * Poll, Option, Vote, DemuxIndexState_ICON
 */
const dataAdapter = new AloxideDataManager({
  dataProviderMap: new Map(),
});

dataProviders.forEach(d => dataAdapter.dataProviderMap.set(d.name, d));

createWatcher({
  bcName: 'ICON',
  accountName: 'cxbc1b71bb40ef97c682114e10981169db23138327',
  aloxideConfig,
  actionReader: new IconActionReader({
    endpoint: 'https://bicon.net.solidwallet.io/api/v3',
    nid: 3,
    logLevel: 'debug',
    logSource: 'reader-ICON',
    startAtBlock: 7563483,
    numRetries: 5,
    waitTimeMs: 2000,
  }),
  dataAdapter,
  logger,
}).then(watcher => {
  return watcher.start();
});
