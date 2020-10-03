const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(url);

const pDB = (handler = db => Promise.resolve(db)) =>
  new Promise((resolve, reject) =>
    client.connect(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    }),
  )
    .then(() => handler(client.db('aloxide')))
    .then(res => {
      client.close();
      return res;
    });

function createModel(entity) {
  function count() {
    return pDB(db => db.collection(entity.name).count());
  }

  function findAll() {
    return pDB(db => db.collection(entity.name).find());
  }

  function findByPk(id) {
    return pDB(db => db.collection(entity.name).find({ _id: id }));
  }

  function create(data, { entity }) {
    data._id = data[entity.key];
    return pDB(db => db.collection(entity.name).insertOne(data));
  }

  function update(data) {
    data._id = data[entity.key];
    return pDB(db => db.collection(entity.name).insertOne(data));
  }

  function destroy(id) {
    return pDB(db => db.collection(entity.name).deleteOne({ _id: id }));
  }

  return {
    name: entity.name,
    count,
    findAll,
    findByPk,
    create,
    update,
    destroy,
  };
}

function createMongoDbConnection(entities) {
  function authenticate() {
    return pDB();
  }

  function sync() {
    return entities.map(({ name }) => pDB(db => db.collection(name).drop()));
  }

  function build(_db) {
    return entities.map(entity => createModel(entity));
  }

  return {
    authenticate,
    sync,
    modelBuilder: {
      build,
    },
  };
}

module.exports = {
  createMongoDbConnection,
};
