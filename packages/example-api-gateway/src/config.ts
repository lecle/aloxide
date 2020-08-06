import { createLogger, Logger } from '@aloxide/logger';
import dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';

dotenv.config();

declare global {
  var _gSequelize: Sequelize;
  var logger: Logger;
}

if (!global.logger) {
  global.logger = createLogger({
    consoleLogger: true,
  });
}

function connectDb() {
  if (!global._gSequelize) {
    global._gSequelize = new Sequelize(
      process.env.app_postgres_db,
      process.env.app_postgres_user,
      process.env.app_postgres_pw,
      {
        host: process.env.app_postgres_host,
        port: parseInt(process.env.app_postgres_port, 10),
        dialect: 'postgres',
      },
    );

    global._gSequelize
      .authenticate()
      .then(() => {
        logger.debug(`Connection to database has been established successfully.`);
      })
      .catch(err => {
        logger.error(`Unable to connect to the database:`, err);
      });
  }

  return global._gSequelize;
}

export default {
  aloxideConfigPath: path.resolve(__dirname, '../config/aloxide.yml'),
  logger: global.logger,
  sequelize: connectDb(),
};
