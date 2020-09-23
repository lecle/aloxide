import IconService from 'icon-sdk-js';

import AccountFactory from './account-factory';
import ContractFactory from './contract-factory';
import BaseNetwork from '../../base-blockchain/base-network';

export default class ICON {
  Account: AccountFactory;
  Contract: ContractFactory;
  iconsdk: IconService;
  network: BaseNetwork;
  constructor(network: BaseNetwork) {
    this.network = network;
    this.iconsdk = new IconService(new IconService.HttpProvider(network.url()));
    this.Account = new AccountFactory(this.iconsdk);
    this.Contract = new ContractFactory(this.iconsdk);
  }
}