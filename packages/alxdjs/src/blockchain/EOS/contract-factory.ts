import Eos from 'eosjs';

import {isInstanceOf} from '../../helpers/is';
import contractFilesReader from '../../helpers/contract-files-reader';
import Account from './account';
import AccountFactory from './account-factory';

export default class ContractFactory {
    eosjs: Eos;

    constructor (eosjs) {
        this.eosjs = eosjs
    }

    async deployOnAccount (wasmPath: String, abiPath: String, contractAccount: Account) {
        const abi = contractFilesReader.readABIFromFile(abiPath);
        const wasm = contractFilesReader.readWASMFromFile(wasmPath);

        const contract = await this.processDeployment(
            wasm,
            abi,
            contractAccount
        );

        return contract;
    }

    private async processDeployment (wasm: Buffer, abi: any, contractAccount: Account) {
        isInstanceOf(contractAccount, 'BaseAccount');

        const setCodeTxReceipt = await this.eosjs.setcode(contractAccount.name, 0, 0, wasm, { keyProvider: contractAccount.privateKey });
        const setAbiTxReceipt = await this.eosjs.setabi(contractAccount.name, abi, { keyProvider: contractAccount.privateKey });

        return {deployedAccount: contractAccount, codeTx: setCodeTxReceipt, abiTx: setAbiTxReceipt};
    }
}
