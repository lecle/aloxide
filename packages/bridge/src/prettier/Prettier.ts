/**
 * Define function that formats code
 * - Cplusplus formater
 * - Python formater
 * - Typescript, Javascript, Json formater
 */
export interface Prettier {
  format(source: string, options: any): string;
}
