import { AbsTypeInterpreter } from '../interpreter/AbsTypeInterpreter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';

export class ICONTypeInterpreter extends AbsTypeInterpreter {
  interpret(type: FieldTypeEnum): string {
    let mappedType: string;

    switch (type) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.uint64_t:
        mappedType = 'int';
        break;
      case FieldTypeEnum.string:
        mappedType = 'str';
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return mappedType;
  }
}
