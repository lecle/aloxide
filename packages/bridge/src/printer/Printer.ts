import { Prettier } from '../prettier/Prettier';

/**
 * define the way to output code
 * - print to a file: FileCoder
 * - return as string: StringCoder
 */
export interface Printer {
  prettier: Prettier;

  /**
   * print code
   */
  print(fileName: string, outputText: string, outputPath?: string);
}
