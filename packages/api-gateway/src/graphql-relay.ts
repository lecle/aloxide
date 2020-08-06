import { FieldTypeEnum, Interpreter } from '@aloxide/bridge';
import { ModelBuilder } from '@aloxide/model';
import { GraphQLObjectType } from 'graphql';
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  ConnectionConfigNodeType,
} from 'graphql-relay';

import { GraphqlTypeInterpreter } from './GraphqlTypeInterpreter';

import type { Logger } from '@aloxide/logger';
import type { GraphQLFieldConfig, GraphQLScalarType, GraphQLNamedType } from 'graphql';
import type { GraphQLConnectionDefinitions } from 'graphql-relay';
import type { AloxideConfig } from '@aloxide/abstraction';
import type { Sequelize } from 'sequelize/types';

export interface CreateGraphQlConfig {
  aloxideConfigPath: string;
  sequelize: Sequelize;
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
  const { aloxideConfigPath, sequelize, logger } = config;
  let { typeInterpreter } = config;

  const modelBuilder = new ModelBuilder({
    aloxideConfigPath,
    logger,
  });

  modelBuilder.build(sequelize);

  const aloxideConfig: AloxideConfig = modelBuilder.aloxideConfig;

  if (!typeInterpreter) {
    typeInterpreter = new GraphqlTypeInterpreter();
  }

  return aloxideConfig.entities.map(({ name, fields }) => {
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
        // TODO fix find all
        return sequelize.models[name].findAll().then(items => connectionFromArray(items, args));
      },
    };

    return {
      graphQLObjectType,
      connectionQueryField,
    };
  });
}
