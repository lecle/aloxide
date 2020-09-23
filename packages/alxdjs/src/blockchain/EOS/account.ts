import Eos from 'eosjs';

import BaseAccount from '../../base-blockchain/base-account';

export default class Account extends BaseAccount {
  eosjs: Eos;

  constructor(privateKey: string, eosjs: Eos, name: string) {
    super(privateKey, name);
    this.eosjs = eosjs;
  }
  async getBalance(symbol: string = 'EOS', code: string = 'eosio.token') {
    return await this.eosjs.getCurrencyBalance(code, this.name, symbol);
  }
}