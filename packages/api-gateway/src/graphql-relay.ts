import { FieldTypeEnum, Interpreter } from '@aloxide/bridge';
import { AloxideDataManager } from '@aloxide/demux';
import { GraphQLObjectType } from 'graphql';
import { connectionArgs, ConnectionConfigNodeType, connectionDefinitions } from 'graphql-relay';

import { GraphqlTypeInterpreter } from './GraphqlTypeInterpreter';
import { convertCursorToOffet, paginationInfo } from './graphql-common-utils';

import type { GraphQLFieldConfig, GraphQLScalarType, GraphQLNamedType } from 'graphql';
import type { GraphQLConnectionDefinitions } from 'graphql-relay';
import type { AloxideConfig } from '@aloxide/abstraction';
import type { Logger, DMeta, QueryInput } from '@aloxide/demux';

export interface CreateGraphQlConfig {
  aloxideConfig: AloxideConfig;
  dataAdapter: AloxideDataManager;
  typeInterpreter?: Interpreter<FieldTypeEnum, GraphQLScalarType>;
  logger?: Logger;
}

type ConnectionQueryField = GraphQLFieldConfig<GraphQLConnectionDefinitions, any> & {
  name: string;
};

export interface CreateGraphQlOutput {
  graphQLObjectType: GraphQLNamedType;
  connectionQueryField: ConnectionQueryField;
}

export function createGraphQl(config: CreateGraphQlConfig): CreateGraphQlOutput[] {
  if (!config || !config.dataAdapter || !config.aloxideConfig) {
    throw new Error('"dataAdapter" and "aloxideConfig" config are required');
  }

  const {
    aloxideConfig: { entities },
    dataAdapter,
    logger,
  } = config;
  let { typeInterpreter } = config;

  dataAdapter.verify(entities.map(({ name }) => name));

  if (!typeInterpreter) {
    typeInterpreter = new GraphqlTypeInterpreter();
  }

  return entities.map(entity => {
    const { name, fields } = entity;

    logger?.debug('create connection for entity:', name);

    const metaData: DMeta = {
      entity,
    };

    const graphQLObjectType = new GraphQLObjectType({
      name,
      fields: fields
        .map(f => ({
          [f.name]: {
            type: typeInterpreter.interpret(f.type as FieldTypeEnum),
          },
        }))
        .reduce((a, c) => Object.assign(a, c), {}),
    });

    const { connectionType } = connectionDefinitions({
      nodeType: (graphQLObjectType as unknown) as ConnectionConfigNodeType,
    });

    const connectionQueryField: ConnectionQueryField = {
      name,
      // @ts-ignore
      type: connectionType,
      args: connectionArgs,
      resolve: (_, args) => {
        const queryInput: QueryInput = convertCursorToOffet(connectionType.name, args);
        return dataAdapter
          .findAll(name, queryInput, metaData)
          .then(items => paginationInfo(connectionType.name, items, args));
      },
    };

    return {
      graphQLObjectType,
      connectionQueryField,
    };
  });
}
