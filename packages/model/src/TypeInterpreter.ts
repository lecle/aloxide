import { FieldTypeEnum, Interpreter } from '@aloxide/bridge';
import { DataTypes } from 'sequelize';

import type { DataType } from 'sequelize/types';

export class TypeInterpreter implements Interpreter<FieldTypeEnum, DataType> {
  interpret(input: FieldTypeEnum): DataType {
    let type: DataType;

    switch (input) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.uint64_t:
        type = DataTypes.INTEGER;
        break;
      case FieldTypeEnum.string:
        type = DataTypes.STRING;
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return type;
  }
}
