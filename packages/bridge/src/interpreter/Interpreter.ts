export interface Interpreter<I, O> {
  interpret(input: I): O;
}
