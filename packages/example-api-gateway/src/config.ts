import { createLogger } from '@aloxide/logger';
import path from 'path';
import { Sequelize } from 'sequelize';

const logger = createLogger({
  consoleLogger: true,
});

function connectDb() {
  const sequelize = new Sequelize('sqlite::memory:');

  sequelize
    .authenticate()
    .then(() => {
      return sequelize.sync({ force: true });
    })
    .then(() => {
      logger.debug('Connection has been established successfully.');
    })
    .catch(err => {
      logger.error('Unable to connect to the database:', err);
    });

  return sequelize;
}

export default {
  aloxideConfigPath: path.resolve(__dirname, '../config/aloxide.yml'),
  resultPath: path.resolve(__dirname, '../contracts'),
  adapter: null,
  logger,
  eosEnable: true,
  modelPath: path.resolve(__dirname, './models/bcModelBuilder.js'),
  sequelize: connectDb(),
};
