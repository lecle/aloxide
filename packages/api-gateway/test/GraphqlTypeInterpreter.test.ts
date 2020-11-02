import { FieldTypeEnum } from '@aloxide/bridge/src';
import { GraphqlTypeInterpreter } from '../src/GraphqlTypeInterpreter';
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';

describe('test GraphqlTypeInterpreter', () => {
  describe('interpret()', () => {
    const intepreter = new GraphqlTypeInterpreter();

    it('should throw error when Field Type is not support', () => {
      expect(() => {
        // @ts-ignore
        intepreter.interpret('not supported type');
      }).toThrowError('unknow type');
    });

    it('should return Graphql Int when the input is uint', () => {
      expect(intepreter.interpret(FieldTypeEnum.uint16_t)).toBe(GraphQLInt);
      expect(intepreter.interpret(FieldTypeEnum.uint32_t)).toBe(GraphQLInt);
      expect(intepreter.interpret(FieldTypeEnum.uint64_t)).toBe(GraphQLInt);
    });

    it('should return Graphql Float when the input is number or double', () => {
      expect(intepreter.interpret(FieldTypeEnum.number)).toBe(GraphQLFloat);
      expect(intepreter.interpret(FieldTypeEnum.double)).toBe(GraphQLFloat);
    });

    it('should return Graphql Boolean when the input is boolean', () => {
      expect(intepreter.interpret(FieldTypeEnum.bool)).toBe(GraphQLBoolean);
    });

    it('should return Graphql String when the input is string', () => {
      expect(intepreter.interpret(FieldTypeEnum.account)).toBe(GraphQLString);
      expect(intepreter.interpret(FieldTypeEnum.string)).toBe(GraphQLString);
    });
  });
});
