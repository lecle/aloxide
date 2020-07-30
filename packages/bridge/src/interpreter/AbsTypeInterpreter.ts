import { FieldTypeEnum } from '../type-definition/FieldTypeEnum';
import { Interpreter } from './Interpreter';

export abstract class AbsTypeInterpreter implements Interpreter<FieldTypeEnum, string> {
  abstract interpret(type: FieldTypeEnum): string;
}
