import IconService from 'icon-sdk-js';

import Account from './account';

export default class AccountFactory {
    iconsdk: IconService;
    coreToken: String;
    constructor (iconsdk: IconService) {
        this.iconsdk = iconsdk;
    }

    load (privateKey: String, name: String = '') {
        try {
            IconService.IconWallet.loadPrivateKey(privateKey);
            return new Account(privateKey, this.iconsdk, name = '');
        } catch (error) {
            throw new Error('Invalid private key. Invalid checksum');
        }
    }

    async createAccount (accountName: String = '') {
        const account = this.iconsdk.IconWallet.create();
        const privateKey = account.getPrivateKey();

        return new Account(privateKey, this.iconsdk, accountName);
    }
}
