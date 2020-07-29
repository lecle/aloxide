import { Prettier } from './Prettier';

export class PythonPrettier implements Prettier {
  format(source: string, _options: any): string {
    return source;
  }
}
