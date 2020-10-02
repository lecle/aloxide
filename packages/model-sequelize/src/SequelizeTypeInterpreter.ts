import { FieldTypeEnum } from '@aloxide/bridge';
import { DataTypes } from 'sequelize';

import type { Interpreter } from '@aloxide/bridge';
import type { DataType } from 'sequelize/types';

export class SequelizeTypeInterpreter implements Interpreter<FieldTypeEnum, DataType> {
  interpret(input: FieldTypeEnum): DataType {
    let type: DataType;

    switch (input) {
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
        type = DataTypes.STRING;
        break;
      default:
        throw new Error(`unknow type ${input}`);
    }

    return type;
  }
}
