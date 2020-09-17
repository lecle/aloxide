import { readAloxideConfig } from '@aloxide/abstraction';
import { createGraphQl, createRouter } from '@aloxide/api-gateway';
import { AloxideDataManager } from '@aloxide/demux';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQLServer, Options } from 'graphql-yoga';

import config from './config';
import { createDataProvider } from './models';

const port = process.env.app_port || 4000;

const aloxideConfig = readAloxideConfig(config.aloxideConfigPath);

const dataAdapter: AloxideDataManager = new AloxideDataManager({
  dataProviderMap: new Map(),
});

const sequelize = config.sequelize;
dataAdapter.dataProviderMap.set('Poll', createDataProvider(sequelize, 'Poll', 'Poll'));
dataAdapter.dataProviderMap.set('Vote', createDataProvider(sequelize, 'Vote', 'Vote'));

const graphqlFields = createGraphQl({
  aloxideConfig,
  dataAdapter,
  logger: config.logger,
});

const graphqlSchema = new GraphQLSchema({
  types: graphqlFields.map(({ graphQLObjectType }) => graphQLObjectType),
  query: new GraphQLObjectType({
    name: 'Query',
    fields: graphqlFields
      .map(({ connectionQueryField }) => connectionQueryField)
      .reduce(
        (a, c) =>
          Object.assign(a, {
            [`query${c.name}`]: c,
          }),
        {},
      ),
  }),
});

// create graphql using graphql yoga
const server = new GraphQLServer({
  schema: graphqlSchema,
});

// sample of using router for express application
const apiGatewayRouter = createRouter({
  aloxideConfig,
  dataAdapter,
  logger: config.logger,
});

const apiGatewayRoute = '/api-gateway';
server.express.use(apiGatewayRoute, apiGatewayRouter);

const serverOptions: Options = {
  port,
  endpoint: '/graphql',
  playground: '/playground',
};

server.start(serverOptions, () => {
  logger.info(`Server is running on http://localhost:${port}`);
  logger.info(`GraphQL is served at: ${serverOptions.endpoint}`);
  logger.info(`ResfullAPI is served at: http://localhost:${port}${apiGatewayRoute}`);
  logger.info(`Playground http://localhost:${port}${serverOptions.playground}`);
});
