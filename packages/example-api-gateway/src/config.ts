import './loadEnv';

import path from 'path';
import { Sequelize } from 'sequelize';

declare global {
  var _gSequelize: Sequelize;
}

export function connectDb(db?: string) {
  let gSequelize: Sequelize;

  switch (process.env.app_database_type) {
    case 'memory':
      gSequelize = new Sequelize('sqlite::memory:', {
        logging: msg => global.logger.debug(msg),
      });
      break;
    case 'sqlite':
      gSequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.resolve(__dirname, '../.cache/database.sqlite'),
        logging: msg => global.logger.debug(msg),
      });
      break;
    case 'postgres':
      gSequelize = new Sequelize(
        db || process.env.app_postgres_db,
        process.env.app_postgres_user,
        process.env.app_postgres_pw,
        {
          host: process.env.app_postgres_host,
          port: parseInt(process.env.app_postgres_port, 10),
          dialect: 'postgres',
          logging: msg => global.logger.debug(msg),
        },
      );
      break;
    default:
      throw new Error(`Unknown database type: ${process.env.app_database_type}`);
  }

  gSequelize
    .authenticate()
    .then(() => {
      logger.debug(`Connection to database has been established successfully.`);
    })
    .catch(err => {
      logger.error(`Unable to connect to the database:`, err);
    });

  return gSequelize;
}

export default {
  aloxideConfigPath: path.resolve(__dirname, '../config/aloxide.yml'),
  logger: global.logger,
  sequelize: connectDb(),
};
