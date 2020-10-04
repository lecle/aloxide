const { FieldTypeEnum } = require('@aloxide/bridge');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'test',
  secretAccessKey: 'test',
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

function createModel(entity) {
  const TableName = entity.name;

  function count() {
    const params = {
      TableName,
      Select: 'COUNT',
    };

    return docClient
      .scan(params)
      .promise()
      .then(({ Count }) => Count);
  }

  function findAll() {
    const params = {
      TableName,
    };

    return docClient
      .scan(params)
      .promise()
      .then(({ Items }) => Items);
  }

  function findByPk(id) {
    const params = {
      TableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': entity.key,
      },
      ExpressionAttributeValues: {
        ':pk': id,
      },
    };

    return docClient
      .query(params)
      .promise()
      .then(({ Items }) => Items[0]);
  }

  function create(data) {
    return docClient
      .put({
        TableName,
        Item: data,
      })
      .promise();
  }

  function update(data) {
    return docClient
      .put({
        TableName,
        Item: data,
      })
      .promise();
  }

  function destroy(id) {
    return docClient
      .delete({
        TableName,
        Key: {
          [entity.key]: id,
        },
      })
      .promise();
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

function mapType(type) {
  let t;
  switch (type) {
    case FieldTypeEnum.string:
      t = 'S';
      break;
    case FieldTypeEnum.uint16_t:
    case FieldTypeEnum.uint32_t:
    case FieldTypeEnum.uint64_t:
    case FieldTypeEnum.double:
    case FieldTypeEnum.number:
      t = 'N';
      break;
  }
  return t;
}

function createTable(entity) {
  const TableName = entity.name;

  const params = {
    TableName,
    KeySchema: [
      {
        AttributeName: entity.key,
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: entity.key,
        AttributeType: mapType(entity.fields.find(f => f.name == entity.key).type),
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 100,
      WriteCapacityUnits: 100,
    },
  };

  return dynamodb
    .createTable(params)
    .promise()
    .then(res => {
      logger.info('-- created dynamodb table:', TableName);
      return res;
    });
}

function createDynamoDbConnection(entities) {
  function authenticate() {
    return dynamodb.listTables({}).promise();
  }
  function sync() {
    return (
      dynamodb
        .listTables()
        .promise()
        /** drop table */
        .then(({ TableNames }) =>
          Promise.all(
            TableNames.filter(TableName => entities.some(({ name }) => name == TableName)).map(
              TableName =>
                dynamodb
                  .deleteTable({
                    TableName,
                  })
                  .promise(),
            ),
          ),
        )
        .then(() => Promise.all(entities.map(entity => createTable(entity))))
    );
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
  createDynamoDbConnection,
};
