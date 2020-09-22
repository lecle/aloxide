import { AbsTypeInterpreter } from '../interpreter/AbsTypeInterpreter';
import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';

export class EOSTypeInterpreter extends AbsTypeInterpreter {
  interpret(type: FieldTypeEnum): string {
    let mappedType: string;

    switch (type) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.double:
        mappedType = 'double';
        break;
      case FieldTypeEnum.uint16_t:
        mappedType = 'uint16_t';
        break;
      case FieldTypeEnum.uint32_t:
        mappedType = 'uint32_t';
        break;
      case FieldTypeEnum.uint64_t:
        mappedType = 'uint64_t';
        break;
      case FieldTypeEnum.string:
        mappedType = 'std::string';
        break;
      case FieldTypeEnum.bool:
        mappedType = 'bool';
        break;
      case FieldTypeEnum.account:
        mappedType = 'eosio::name';
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return mappedType;
  }
}
