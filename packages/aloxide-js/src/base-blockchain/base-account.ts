export default class BaseAccount {
  privateKey: string;
  name: string;

  constructor(privateKey, name) {
    this.privateKey = privateKey;
    this.name = name;
  }
}