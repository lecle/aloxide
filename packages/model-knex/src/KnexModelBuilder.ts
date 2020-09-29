import { FieldTypeEnum } from '@aloxide/bridge';

import { KnexTypeInterpreter } from './KnexTypeInterpreter';

import type { SchemaBuilder, CreateTableBuilder } from 'knex';
import type { AloxideConfig } from '@aloxide/abstraction';
import type { EntityConfig, Field, Interpreter } from '@aloxide/bridge';
import type { Logger } from './Logger';
import type { DataType } from './DataType';

export interface ModelBuilderConfig {
  aloxideConfig: AloxideConfig;
  typeInterpreter?: Interpreter<FieldTypeEnum, DataType>;
  logger?: Logger;
}

export class KnexModelBuilder {
  aloxideConfig: AloxideConfig;
  typeInterpreter: Interpreter<FieldTypeEnum, DataType>;
  logger?: Logger;

  constructor({ aloxideConfig, typeInterpreter, logger }: ModelBuilderConfig) {
    this.aloxideConfig = aloxideConfig;
    this.logger = logger;

    if (typeInterpreter) {
      this.typeInterpreter = typeInterpreter;
    } else {
      this.typeInterpreter = new KnexTypeInterpreter();
    }
  }

  build(sb: SchemaBuilder): SchemaBuilder {
    return this.aloxideConfig.entities.reduce(
      (a, c) => KnexModelBuilder.makeModelFromEntityConfig(a, this.typeInterpreter, c),
      sb,
    );
  }

  static makeModelFromEntityConfig(
    sb: SchemaBuilder,
    typeInterpreter: Interpreter<FieldTypeEnum, DataType>,
    entityConfig: EntityConfig,
  ): SchemaBuilder {
    const { name, fields, key } = entityConfig;
    return sb.createTable(name, KnexModelBuilder.mapField(typeInterpreter, fields, key));
  }

  static mapField(
    typeInterpreter: Interpreter<FieldTypeEnum, DataType>,
    fields: Field[],
    key: string,
  ): (table: CreateTableBuilder) => any {
    return (table: CreateTableBuilder) => {
      fields.forEach(f => {
        typeInterpreter.interpret(f.type as FieldTypeEnum)(table, f, key);
      });
    };
  }
}
