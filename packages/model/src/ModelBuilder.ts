import { AloxideConfig, readAloxideConfig } from '@aloxide/abstraction';
import { FieldTypeEnum, Interpreter } from '@aloxide/bridge';

import { TypeInterpreter } from './TypeInterpreter';

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
      this.typeInterpreter = new TypeInterpreter();
    }
  }

  build(sequelize: Sequelize): ModelCtor<Model>[] {
    return this.aloxideConfig.entities.map(({ name, fields, key }) =>
      sequelize.define(
        name,
        fields.reduce((a, c) => {
          const field: ModelAttributeColumnOptions<Model> = {
            type: this.typeInterpreter.interpret(c.type as FieldTypeEnum),
          };

          if (c.name === key) {
            field.primaryKey = true;
            field.autoIncrement = true;
          }

          return Object.assign(a, {
            [c.name]: field,
          });
        }, {}),
      ),
    );
  }
}
