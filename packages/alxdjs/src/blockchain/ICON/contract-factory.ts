import IconService from 'icon-sdk-js';

import { isInstanceOf } from '../../helpers/is';
import contractFilesReader from '../../helpers/contract-files-reader';
import Account from './account';

export default class ContractFactory {
    iconsdk: IconService;

    constructor(iconsdk) {
        this.iconsdk = iconsdk
    }

    async deployOnAccount(path: String, params: Object = {}, deployAccount: Account) {
        isInstanceOf(deployAccount, 'BaseAccount');
        const psContent = contractFilesReader.readPSFromFile(path).toString('hex');
        return this.processDeployment(psContent, params, deployAccount);
    }

    private async processDeployment (contractContent: any, params: Object, deployAccount: Account) {
        const wallet = IconService.IconWallet.loadPrivateKey(deployAccount.privateKey);
        const transaction = await this.buildDeployTransaction(contractContent, params, wallet.getAddress());
        const signedTransaction = await this.signedTransaction(transaction, wallet);
        return await this.pushTransaction(signedTransaction);
    }

    private async buildDeployTransaction(content: any, params: Object, walletAddress: String) {

        const { DeployTransactionBuilder } = IconService.IconBuilder;
        const contentType = "application/zip";

        const stepLimit = await this.getMaxStepLimit();
        const networkId = IconService.IconConverter.toBigNumber(3);
        const version = IconService.IconConverter.toBigNumber(3);
        const timestamp = (new Date()).getTime() * 1000;

        const deployTransactionBuilder = new DeployTransactionBuilder();
        const transaction = deployTransactionBuilder
            .nid(networkId)
            .from(walletAddress)
            .to('cx0000000000000000000000000000000000000000')
            .stepLimit(stepLimit)
            .timestamp(timestamp)
            .contentType(contentType)
            .content(`0x${content}`)
            .params(params)
            .version(version)
            .build();
        return transaction;
    }

    private async signedTransaction(transaction: IconService.IconBuilder.DeployTransactionBuilder, wallet: IconService.IconWallet) {
        const signedTransaction = new IconService.SignedTransaction(transaction, wallet);
        const signedTransactionProperties = JSON.stringify(signedTransaction.getProperties()).split(",").join(", \n");
        return signedTransaction
    }

    async pushTransaction(signedTransaction: IconService.SignedTransaction) {
        const txHash = await this.iconsdk.sendTransaction(signedTransaction).execute();
        return txHash;
    }

    async getTransaction(txHash: String) {
        const transactionResult = await this.iconsdk.getTransactionResult(txHash).execute();
        return transactionResult;
    }
    async getMaxStepLimit() {
        const { CallBuilder } = IconService.IconBuilder;
        const governanceApi = await this.iconsdk.getScoreApi('cx0000000000000000000000000000000000000001').execute();
        const methodName = 'getMaxStepLimit';
        const getMaxStepLimitApi = governanceApi.getMethod(methodName);
        const params = {};
        params[getMaxStepLimitApi.inputs[0].name] = 'invoke';
        const callBuilder = new CallBuilder();
        const call = callBuilder
            .to('cx0000000000000000000000000000000000000001')
            .method(methodName)
            .params(params)
            .build();
        const maxStepLimit = await this.iconsdk.call(call).execute();
        return IconService.IconConverter.toBigNumber(maxStepLimit)
    }
}
