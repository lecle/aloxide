import { AloxideConfig, readAloxideConfig } from '@aloxide/abstraction';
import { EntityConfig, Field, FieldTypeEnum, Interpreter } from '@aloxide/bridge';

import { SequelizeTypeInterpreter } from './SequelizeTypeInterpreter';

import type {
  Model,
  ModelCtor,
  Sequelize,
  DataType,
  ModelAttributeColumnOptions,
} from 'sequelize/types';
import type { Logger } from '@aloxide/logger';

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
      ModelBuilder.makeModelFromEntityConfig(sequelize, entityConfig, this.typeInterpreter),
    );
  }

  static makeModelFromEntityConfig(
    sequelize: Sequelize,
    entityConfig: EntityConfig,
    typeInterpreter: Interpreter<FieldTypeEnum, DataType>,
  ) {
    const { name, fields, key } = entityConfig;
    return sequelize.define(name, ModelBuilder.mapField(typeInterpreter, fields, key));
  }

  static mapField(
    typeInterpreter: Interpreter<FieldTypeEnum, DataType>,
    fields: Field[],
    key: string,
  ) {
    return fields.reduce((a, c) => {
      const field: ModelAttributeColumnOptions<Model> = {
        type: typeInterpreter.interpret(c.type as FieldTypeEnum),
      };

      if (c.name === key) {
        field.primaryKey = true;
        field.autoIncrement = true;
      }

      return Object.assign(a, {
        [c.name]: field,
      });
    }, {});
  }
}
