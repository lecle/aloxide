import { jest } from '@jest/globals';

import { Prettier } from '../../prettier/Prettier';
import { Printer } from '../Printer';

/**
 * Print output code to files
 */
export class FilePrinter implements Printer {
  prettier: Prettier;
  print = jest.fn();
  ensureExistingFolder = jest.fn();
}
