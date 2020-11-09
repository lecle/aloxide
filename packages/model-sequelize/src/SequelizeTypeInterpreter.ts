import { FieldTypeEnum } from '@aloxide/bridge';
import { DataTypes, TextLength } from 'sequelize';

import type { Interpreter, Field } from '@aloxide/bridge';
import type { DataType } from 'sequelize/types';

export class SequelizeTypeInterpreter implements Interpreter<Field, DataType> {
  interpret(input: Field): DataType {
    let type: DataType;

    switch (input.type) {
      case FieldTypeEnum.uint16_t:
        type = DataTypes.SMALLINT;
        break;
      case FieldTypeEnum.uint32_t:
        type = DataTypes.INTEGER;
        break;
      case FieldTypeEnum.uint64_t:
        type = DataTypes.BIGINT;
        break;
      case FieldTypeEnum.number:
      case FieldTypeEnum.double:
        type = DataTypes.DOUBLE;
        break;
      case FieldTypeEnum.bool:
        type = DataTypes.BOOLEAN;
        break;
      case FieldTypeEnum.account:
        type = DataTypes.STRING;
        break;
      case FieldTypeEnum.string:
        if (input.meta) {
          if (input.meta.length) {
            type = DataTypes.STRING(input.meta.length);
          } else if (input.meta.type) {
            type = DataTypes.TEXT({
              length: input.meta.type as TextLength,
            });
          }
        }

        if (!type) {
          type = DataTypes.TEXT;
        }
        break;
      default:
        throw new Error(`unknow type ${input}`);
    }

    return type;
  }
}
