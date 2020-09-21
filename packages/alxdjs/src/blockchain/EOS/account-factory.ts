import Eos from 'eosjs';
const eosECC = require('eosjs').modules.ecc;

import Account from './account';
import {isInstanceOf} from '../../helpers/is';


export default class AccountFactory {
    coreToken: String;
    eosjs: Eos;
    constructor (eosjs, coreToken) {
        this.eosjs = eosjs;
        this.coreToken = coreToken
    }

    load (privateKey: String, name: String) {
        try {
            eosECC.PrivateKey.fromString(privateKey).toPublic().toString();
            return new Account(privateKey, this.eosjs, name);
        } catch (error) {
            throw new Error('Invalid private key. Invalid checksum');
        }
    }

    async createFromName (accountName: String, accountCreator: Account = this.eosjs.defaultAccount ) {
        isInstanceOf(accountCreator, 'BaseAccount');
        const privateKey = await eosECC.randomKey();
        const newAccount = new Account(privateKey, this.eosjs, accountName,);

        await this.createAccountOnBlockchain(newAccount, accountCreator);

        return newAccount;
    }

    async createAccountOnBlockchain(newAccount: Account, accountCreator: Account){
        const newAccountPublicKey = eosECC.PrivateKey.fromString(newAccount.privateKey).toPublic().toString();
        await this.eosjs.transaction(tr => {
            tr.newaccount({
                creator: accountCreator.name,
                name: newAccount.name,
                owner: newAccountPublicKey,
                active: newAccountPublicKey
            });
    
            tr.buyrambytes({
                payer: accountCreator.name,
                receiver: newAccount.name,
                bytes: 8192
            });

            tr.delegatebw({
                from: accountCreator.name,
                receiver: newAccount.name,
                stake_net_quantity: '10.0000 ' + this.coreToken,
                stake_cpu_quantity: '10.0000 ' + this.coreToken,
                transfer: 0
            });
    
        }, { keyProvider: accountCreator.privateKey });
    };

}
