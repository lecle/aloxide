import { AbsTypeInterpreter } from '../interpreter/AbsTypeInterpreter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';

export class ModelTypeInterpreter extends AbsTypeInterpreter {
  interpret(type: FieldTypeEnum): string {
    let mType: string;
    switch (type) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.double:
        mType = 'DataTypes.DOUBLE';
        break;
      case FieldTypeEnum.uint16_t:
      case FieldTypeEnum.uint32_t:
      case FieldTypeEnum.uint64_t:
        mType = 'DataTypes.INTEGER';
        break;
      case FieldTypeEnum.account:
      case FieldTypeEnum.string:
        mType = 'DataTypes.STRING';
        break;
      case FieldTypeEnum.bool:
        mType = 'DataTypes.BOOLEAN';
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }
    return mType;
  }
}
