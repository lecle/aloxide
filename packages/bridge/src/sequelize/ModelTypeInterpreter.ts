import { AbsTypeInterpreter } from '../interpreter/AbsTypeInterpreter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';

export class ModelTypeInterpreter extends AbsTypeInterpreter {
  interpret(type: FieldTypeEnum): string {
    let mType: string;
    switch (type) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.uint64_t:
        mType = 'DataTypes.INTEGER';
        break;
      case FieldTypeEnum.string:
        mType = 'DataTypes.STRING';
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }
    return mType;
  }
}
