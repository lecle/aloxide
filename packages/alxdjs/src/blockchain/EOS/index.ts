import Eos from 'eosjs';

import AccountFactory from './account-factory';
import ContractFactory from './contract-factory';
import BaseNetwork from '../../base-blockchain/base-network';

export default class EOS {
  Account: AccountFactory;
  Contract: ContractFactory;
  eosjs: Eos;
  network: BaseNetwork;

  constructor(network: BaseNetwork) {
    this.network = network;
    this.eosjs = Eos({
      httpEndpoint: network.url(),
      chainId: network.chainId,
    });
    this.Account = new AccountFactory(this.eosjs, this.network.coreToken);
    this.Contract = new ContractFactory(this.eosjs);
  }
}