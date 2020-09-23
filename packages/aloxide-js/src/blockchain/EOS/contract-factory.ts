import Eos from 'eosjs';

import {
  isInstanceOf
} from '../../helpers/is';
import ContractFilesReader from '../../helpers/contract-files-reader';
import Account from './account';

export default class ContractFactory {
  eosjs: Eos;

  constructor(eosjs) {
    this.eosjs = eosjs
  }

  async deployOnAccount(wasmPath: string, abiPath: string, contractAccount: Account) {
    const abi = ContractFilesReader.readABIFromFile(abiPath);
    const wasm = ContractFilesReader.readWASMFromFile(wasmPath);

    const contract = await this.processDeployment(
      wasm,
      abi,
      contractAccount
    );

    return contract;
  }

  private async processDeployment(wasm: Buffer, abi: any, contractAccount: Account) {
    isInstanceOf(contractAccount, 'BaseAccount');

    const setCodeTxReceipt = await this.eosjs.setcode(contractAccount.name, 0, 0, wasm, {
      keyProvider: contractAccount.privateKey
    });
    const setAbiTxReceipt = await this.eosjs.setabi(contractAccount.name, abi, {
      keyProvider: contractAccount.privateKey
    });

    return {
      deployedAccount: contractAccount,
      codeTx: setCodeTxReceipt,
      abiTx: setAbiTxReceipt
    };
  }
}