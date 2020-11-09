import {
  DataType,
  DataTypes,
  Model,
  ModelAttributeColumnOptions,
  ModelAttributes,
  ModelCtor,
  Sequelize,
} from 'sequelize';

import { SequelizeTypeInterpreter } from './SequelizeTypeInterpreter';

import type { AloxideConfig } from '@aloxide/abstraction';
import type { EntityConfig, Field, Interpreter } from '@aloxide/bridge';
import type { Logger } from './Logger';

export interface ModelBuilderConfig {
  aloxideConfig: AloxideConfig;
  typeInterpreter?: Interpreter<Field, DataType>;
  logger?: Logger;
}

export class ModelBuilder {
  aloxideConfig: AloxideConfig;
  typeInterpreter: Interpreter<Field, DataType>;
  logger?: Logger;

  constructor({ aloxideConfig, typeInterpreter, logger }: ModelBuilderConfig) {
    this.aloxideConfig = aloxideConfig;
    this.logger = logger;

    if (typeInterpreter) {
      this.typeInterpreter = typeInterpreter;
    } else {
      this.typeInterpreter = new SequelizeTypeInterpreter();
    }
  }

  build(sequelize: Sequelize): ModelCtor<Model>[] {
    return this.aloxideConfig.entities.map(entityConfig =>
      ModelBuilder.makeModelFromEntityConfig(sequelize, this.typeInterpreter, entityConfig),
    );
  }

  static makeModelFromEntityConfig(
    sequelize: Sequelize,
    typeInterpreter: Interpreter<Field, DataType>,
    entityConfig: EntityConfig,
  ): ModelCtor<Model> {
    const { name, fields, key } = entityConfig;
    return sequelize.define(name, ModelBuilder.mapField(typeInterpreter, fields, key));
  }

  static mapField(
    typeInterpreter: Interpreter<Field, DataType>,
    fields: Field[],
    key: string,
  ): ModelAttributes {
    return fields.reduce((a, c) => {
      const field: ModelAttributeColumnOptions<Model> = {
        type: typeInterpreter.interpret(c),
      };

      if (c.name === key) {
        field.primaryKey = true;
        switch (field.type) {
          case DataTypes.SMALLINT:
          case DataTypes.INTEGER:
          case DataTypes.BIGINT:
          case DataTypes.NUMBER:
          case DataTypes.DOUBLE:
            field.autoIncrement = true;
            break;
        }
      }

      return Object.assign(a, {
        [c.name]: field,
      });
    }, {});
  }
}
