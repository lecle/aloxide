import { createGraphQl, createRouter } from '@aloxide/api-gateway';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQLServer, Options } from 'graphql-yoga';

import config from './config';

const port = process.env.app_port || 4000;

const graphqlFields = createGraphQl({
  aloxideConfigPath: config.aloxideConfigPath,
  sequelize: config.sequelize,
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
  aloxideConfigPath: config.aloxideConfigPath,
  sequelize: config.sequelize,
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
