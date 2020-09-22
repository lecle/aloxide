import { AbsTypeInterpreter } from '../interpreter/AbsTypeInterpreter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';

export class ICONTypeInterpreter extends AbsTypeInterpreter {
  interpret(type: FieldTypeEnum): string {
    let mappedType: string;

    switch (type) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.uint64_t:
      case FieldTypeEnum.uint32_t:
      case FieldTypeEnum.uint16_t:
      case FieldTypeEnum.double:
        mappedType = 'int';
        break;
      case FieldTypeEnum.string:
        mappedType = 'str';
        break;
      case FieldTypeEnum.account:
        mappedType = 'Address';
        break;
      case FieldTypeEnum.bool:
        mappedType = 'bool';
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return mappedType;
  }
}
