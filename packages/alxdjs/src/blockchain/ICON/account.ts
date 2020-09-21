import IconService from 'icon-sdk-js';
import BaseAccount from '../../base-blockchain/base-account';

export default class Account extends BaseAccount {
    iconsdk: IconService;

    constructor (privateKey: String, iconsdk: IconService, name: String) {
        super(privateKey, name);
        this.iconsdk = iconsdk;
    }
    async getBalance (address: String) {
        return await this.iconsdk.getBalance(address);
    }
}