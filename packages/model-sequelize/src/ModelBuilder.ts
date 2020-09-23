import { readAloxideConfig } from '@aloxide/abstraction';
import { FieldTypeEnum } from '@aloxide/bridge';
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
  aloxideConfigPath: string;
  logger?: Logger;
  typeInterpreter?: Interpreter<FieldTypeEnum, DataType>;
}

export class ModelBuilder {
  aloxideConfig: AloxideConfig;
  typeInterpreter: Interpreter<FieldTypeEnum, DataType>;

  constructor({ aloxideConfigPath, logger, typeInterpreter }: ModelBuilderConfig) {
    this.aloxideConfig = readAloxideConfig(aloxideConfigPath, logger);

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
    typeInterpreter: Interpreter<FieldTypeEnum, DataType>,
    entityConfig: EntityConfig,
  ): ModelCtor<Model> {
    const { name, fields, key } = entityConfig;
    return sequelize.define(name, ModelBuilder.mapField(typeInterpreter, fields, key));
  }

  static mapField(
    typeInterpreter: Interpreter<FieldTypeEnum, DataType>,
    fields: Field[],
    key: string,
  ): ModelAttributes {
    return fields.reduce((a, c) => {
      const field: ModelAttributeColumnOptions<Model> = {
        type: typeInterpreter.interpret(c.type as FieldTypeEnum),
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
