import { FieldTypeEnum, Interpreter } from '@aloxide/bridge';
import { GraphQLInt, GraphQLScalarType, GraphQLString } from 'graphql';

export class GraphqlTypeInterpreter implements Interpreter<FieldTypeEnum, GraphQLScalarType> {
  interpret(input: FieldTypeEnum): GraphQLScalarType {
    let type: GraphQLScalarType;

    switch (input) {
      case FieldTypeEnum.number:
      case FieldTypeEnum.uint64_t:
        type = GraphQLInt;
        break;
      case FieldTypeEnum.string:
        type = GraphQLString;
        break;
      default:
        throw new Error(`unknow type ${type}`);
    }

    return type;
  }
}
