import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';
import { AbsTypeInterpreter } from './AbsTypeInterpreter';

export class ICONTypeInterpreter extends AbsTypeInterpreter {
  interpret(type: FieldTypeEnum): string {
    let mappedType: string;

    switch (type) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.uint64_t:
        mappedType = 'number';
        break;
      case FieldTypeEnum.string:
        mappedType = 'string';
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return mappedType;
  }
}
