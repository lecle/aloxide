import { FieldTypeEnum, Interpreter } from '@aloxide/bridge';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLScalarType, GraphQLString } from 'graphql';

export class GraphqlTypeInterpreter implements Interpreter<FieldTypeEnum, GraphQLScalarType> {
  interpret(input: FieldTypeEnum): GraphQLScalarType {
    let type: GraphQLScalarType;

    switch (input) {
      case FieldTypeEnum.uint16_t:
      case FieldTypeEnum.uint32_t:
      case FieldTypeEnum.uint64_t:
        type = GraphQLInt;
        break;
      case FieldTypeEnum.number:
      case FieldTypeEnum.double:
        type = GraphQLFloat;
        break;
      case FieldTypeEnum.bool:
        type = GraphQLBoolean;
        break;
      case FieldTypeEnum.account:
      case FieldTypeEnum.string:
        type = GraphQLString;
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return type;
  }
}
