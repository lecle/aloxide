import IconService from 'icon-sdk-js';
import BaseAccount from '../../base-blockchain/base-account';

export default class Account extends BaseAccount {
  iconsdk: IconService;

  constructor(privateKey: string, iconsdk: IconService, name: string) {
    super(privateKey, name);
    this.iconsdk = iconsdk;
  }
  async getBalance(address: string) {
    return await this.iconsdk.getBalance(address);
  }
}
