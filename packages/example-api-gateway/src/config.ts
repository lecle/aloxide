import './loadEnv';

import path from 'path';
import { Sequelize } from 'sequelize';

declare global {
  var _gSequelize: Sequelize;
}

export function connectDb(db?: string) {
  const gSequelize = new Sequelize(
    db || process.env.app_postgres_db,
    process.env.app_postgres_user,
    process.env.app_postgres_pw,
    {
      host: process.env.app_postgres_host,
      port: parseInt(process.env.app_postgres_port, 10),
      dialect: 'postgres',
    },
  );

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
