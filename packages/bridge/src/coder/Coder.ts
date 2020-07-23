import { Prettier } from '../prettier/Prettier';

/**
 * define the way to output code
 * - print to a file: FileCoder
 * - return as string: StringCoder
 */
export interface Coder {
  prettier: Prettier;

  /**
   * print code
   */
  code(fileName: string, outputText: string, outputPath?: string);
}
