import { Prettier } from './Prettier';

/**
 * this can be used for:
 * -json
 * -js
 * -ts
 */
export class JsPrettier implements Prettier {
  format(source: string, _options: any): string {
    return source;
  }
}
