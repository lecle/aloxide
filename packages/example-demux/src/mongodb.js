const { MongoClient } = require('mongodb');

function makeObjId(str) {
  return str;
}

// Connection URL
const url = 'mongodb://aloxide:localhost-pw2020@localhost:27017';

// Create a new MongoClient
const client = new MongoClient(url);

let db;

// Use connect method to connect to the Server
let pConnectDb;

function createModel(entity, mongoDb) {
  let coll;

  function count() {
    return Promise.resolve(coll.count());
  }

  function findAll() {
    return Promise.resolve(find(coll.find()));
  }

  function findByPk(id) {
    return Promise.resolve(coll.findOne({ _id: makeObjId(id) }));
  }

  function create(data) {
    const obj = {
      _id: makeObjId(data[entity.key]),
      ...data,
    };
    return Promise.resolve(coll.insertOne(obj)).then(() => data);
  }

  function update(data) {
    const obj = {
      _id: makeObjId(data[entity.key]),
      ...data,
    };
    return Promise.resolve(coll.replaceOne({ _id: obj._id }, obj)).then(() => data);
  }

  function destroy(id) {
    return Promise.resolve(coll.deleteOne({ _id: makeObjId(id) })).then(() => true);
  }

  const name = entity.name;
  return mongoDb
    .dropCollection(name)
    .catch(() => {
      logger.debug('---- drop collection does not exist', name);
    })
    .then(() => {
      return mongoDb.createCollection(name);
    })
    .then(() => {
      logger.info('-- created mongodb collection:', name);
      coll = mongoDb.collection(name);
    })
    .then(() => ({
      name: entity.name,
      count,
      findAll,
      findByPk,
      create,
      update,
      destroy,
    }));
}

function createMongoDbConnection(entities) {
  pConnectDb = new Promise((resolve, reject) =>
    client.connect(function(err) {
      if (err) {
        return reject(err);
      }

      db = client.db('aloxide');
      resolve(db);
    }),
  );

  function authenticate() {
    return pConnectDb;
  }

  function sync() {
    return pConnectDb;
  }

  function build(_db) {
    return Promise.all(entities.map(entity => createModel(entity, db)));
  }

  return {
    authenticate,
    sync,
    modelBuilder: {
      build,
    },
  };
}

process.on('unhandledRejection', function(reason, p) {
  logger.error('Unhandled', reason, p); // log all your errors, "unsuppressing" them.
  client.close();
  process.exit(1);
});

module.exports = {
  createMongoDbConnection,
};
