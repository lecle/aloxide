import Eos from 'eosjs';
import eosEcc from 'eosjs-ecc';

import Account from './account';
import {
  isInstanceOf
} from '../../helpers/is';


export default class AccountFactory {
  coreToken: string;
  eosjs: Eos;
  constructor(eosjs, coreToken) {
    this.eosjs = eosjs;
    this.coreToken = coreToken
  }

  load(privateKey: string, name: string) {
    try {
      eosEcc.PrivateKey.fromString(privateKey).toPublic().toString();
      return new Account(privateKey, this.eosjs, name);
    } catch (error) {
      throw new Error('Invalid private key. Invalid checksum');
    }
  }

  async createFromName(accountName: string, accountCreator: Account = this.eosjs.defaultAccount) {
    isInstanceOf(accountCreator, 'BaseAccount');
    const privateKey = await eosEcc.randomKey();
    const newAccount = new Account(privateKey, this.eosjs, accountName, );

    await this.createAccountOnBlockchain(newAccount, accountCreator);

    return newAccount;
  }

  async createAccountOnBlockchain(newAccount: Account, accountCreator: Account) {
    const newAccountPublicKey = eosEcc.PrivateKey.fromString(newAccount.privateKey).toPublic().toString();
    await this.eosjs.transaction(tx => {
      tx.newaccount({
        creator: accountCreator.name,
        name: newAccount.name,
        owner: newAccountPublicKey,
        active: newAccountPublicKey
      });

      tx.buyrambytes({
        payer: accountCreator.name,
        receiver: newAccount.name,
        bytes: 8192
      });

      tx.delegatebw({
        from: accountCreator.name,
        receiver: newAccount.name,
        stake_net_quantity: '10.0000 ' + this.coreToken,
        stake_cpu_quantity: '10.0000 ' + this.coreToken,
        transfer: 0
      });

    }, {
      keyProvider: accountCreator.privateKey
    });
  };

}
