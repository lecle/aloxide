export default class BaseAccount {
  name: string;
  privateKey: string;

  constructor(name: string, privateKey?: string) {
    this.name = name;
    this.privateKey = privateKey;

    if (!privateKey) {
      this.privateKey = name;
    }
  }
}
