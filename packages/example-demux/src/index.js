const path = require('path');
const { readAloxideConfig } = require('@aloxide/abstraction');
const { createWatcher, indexStateSchema, AloxideDataManager } = require('@aloxide/demux');
const { ModelBuilder } = require('@aloxide/model-sequelize');
const Logger = require('bunyan');
const Sequelize = require('sequelize');
const { IconActionReader } = require('@aloxide/demux-icon');
const { createDynamoDbConnection } = require('./dynamodb');
const { createMongoDbConnection } = require('./mongodb');

global.logger = Logger.createLogger({
  name: 'example-demux',
  level: 'info',
  src: false,
});

const aloxideConfig = readAloxideConfig(path.resolve('./aloxide.yml'), logger);

indexStateSchema.name = 'DemuxIndexState_ICON';
aloxideConfig.entities.push(indexStateSchema);

const modelNames = aloxideConfig.entities.map(({ name }) => name);

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
  { dbType: 'dynamo', enable: true },
  { dbType: 'mongo', enable: true },
  { dbType: 'memory', enable: false },
]; // TODO add more database type

const dbModels = db
  .filter(({ enable }) => enable)
  .map(({ dbType }) => {
    let db;
    const options = {
      logging: msg => logger.debug(msg),
    };

    switch (dbType) {
      case 'memory':
        db = new Sequelize('sqlite::memory:', options);
        break;
      case 'postgres':
        db = new Sequelize('postgres://aloxide:localhost-pw2020@localhost:5432/aloxide', options);
        break;
      case 'mysql':
        db = new Sequelize('mysql://root:localhost-pw2020@localhost:3306/aloxide', options);
        break;
      case 'mongo':
        db = createMongoDbConnection(aloxideConfig.entities);
        break;
      case 'dynamo':
        db = createDynamoDbConnection(aloxideConfig.entities);
        break;
    }

    return {
      dbType,
      db,
      modelBuilder: db && db.modelBuilder ? db.modelBuilder : modelBuilder,
      models: null,
    };
  })
  .filter(({ db }) => !!db);

const defaultOrm = dbModels[0];

if (!defaultOrm) {
  throw new Error('There is no database');
}
function getModel(models, name) {
  return models.find(m => m.name == name);
}

// initialize database connection requires running in asynchronization
Promise.all(
  dbModels.map(dbModel => {
    const { db, modelBuilder } = dbModel;

    return db
      .authenticate()
      .then(() => modelBuilder.build(db))
      .then(models => (dbModel.models = models))
      .then(() =>
        db.sync({
          force: true,
        }),
      );
  }),
).then(() => {
  const dataProviders = modelNames.map(name => {
    const isIndexState = name == indexStateSchema.name;

    return {
      name,
      setup() {
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
});
