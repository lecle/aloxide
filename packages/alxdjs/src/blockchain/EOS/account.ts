import Eos from 'eosjs';

import BaseAccount from '../../base-blockchain/base-account';

export default class Account extends BaseAccount {
    eosjs: Eos;

    constructor (privateKey: String, eosjs: Eos, name: String) {
        super(privateKey, name);
        this.eosjs = eosjs;
    }
    async getBalance (symbol: String = 'EOS', code: String = 'eosio.token') {
        return await this.eosjs.getCurrencyBalance(code, this.name, symbol);
    }
}