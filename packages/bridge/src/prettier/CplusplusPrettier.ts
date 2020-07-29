import { Prettier } from './Prettier';

export class CplusplusPrettier implements Prettier {
  format(source: string, _options: any): string {
    return source;
  }
}
