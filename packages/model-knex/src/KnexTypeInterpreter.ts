import { FieldTypeEnum } from '@aloxide/bridge';

import type { ColumnBuilder, CreateTableBuilder } from 'knex';
import type { Interpreter } from '@aloxide/bridge';
import type { DataType } from './DataType';

export class KnexTypeInterpreter implements Interpreter<FieldTypeEnum, DataType> {
  interpret(input: FieldTypeEnum): DataType {
    let type: DataType;

    switch (input) {
      case FieldTypeEnum.uint16_t:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.integer(f.name);
        };
        break;
      case FieldTypeEnum.uint32_t:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.integer(f.name);
        };
        break;
      case FieldTypeEnum.uint64_t:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.integer(f.name);
        };
        break;
      case FieldTypeEnum.number:
      case FieldTypeEnum.double:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.integer(f.name);
        };
        break;
      case FieldTypeEnum.bool:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.boolean(f.name);
        };
        break;
      case FieldTypeEnum.account:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.string(f.name);
        };
        break;
      case FieldTypeEnum.string:
        type = (table: CreateTableBuilder, f, key: string): ColumnBuilder => {
          return table.string(f.name);
        };
        break;
      default:
        throw new Error(`unknow type ${input}`);
    }

    return type;
  }
}
