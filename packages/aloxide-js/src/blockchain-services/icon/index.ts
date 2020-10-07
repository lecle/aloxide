import IconService, { HttpProvider, IconBuilder, SignedTransaction, Wallet } from 'icon-sdk-js';
import { ContractPath, NetworkConfig } from '../TypeDefinitions';
import { BlockchainAccount } from '../BlockchainAccount';
import { BlockchainService } from '../BlockchainService';
import ContractFilesReader from '../../helpers/contract-files-reader';

const { DeployTransactionBuilder } = IconBuilder;

export class IconBlockchainService extends BlockchainService {
  client: IconService;

  constructor(config: NetworkConfig) {
    super(config);

    this.client = new IconService(new HttpProvider(this.url()));
  }

  deployContract(
    contractPath: ContractPath,
    account: BlockchainAccount,
    opts: { params: object } = { params: {} },
  ) {
    const { psPath } = contractPath;
    const pyContent = ContractFilesReader.readPSFromFile(psPath).toString('hex');
    return this.processDeployment(pyContent, account, opts.params);
  }

  private async processDeployment(
    contractContent: any,
    account: BlockchainAccount,
    params: object,
  ) {
    const wallet = IconService.IconWallet.loadPrivateKey(account.privateKey);
    const transaction = await this.buildDeployTransaction(
      contractContent,
      params,
      wallet.getAddress(),
    );
    const signedTransaction = await this.signedTransaction(transaction, wallet);
    return await this.pushTransaction(signedTransaction);
  }

  private async buildDeployTransaction(content: any, params: object, walletAddress: string) {
    const contentType = 'application/zip';

    const stepLimit = await this.getMaxStepLimit();
    const networkId = IconService.IconConverter.toBigNumber(3);
    const version = IconService.IconConverter.toBigNumber(3);
    const timestamp = new Date().getTime() * 1000;

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

  private async signedTransaction(
    transaction: InstanceType<typeof DeployTransactionBuilder>,
    wallet: InstanceType<typeof Wallet>,
  ) {
    const signedTransaction = new IconService.SignedTransaction(transaction, wallet);
    return signedTransaction;
  }

  async pushTransaction(signedTransaction: InstanceType<typeof SignedTransaction>) {
    const txHash = await this.client.sendTransaction(signedTransaction).execute();
    return txHash;
  }

  async getMaxStepLimit() {
    const { CallBuilder } = IconService.IconBuilder;
    const governanceApi = await this.client
      .getScoreApi('cx0000000000000000000000000000000000000001')
      .execute();
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
    const maxStepLimit = await this.client.call(call).execute();

    return IconService.IconConverter.toBigNumber(maxStepLimit);
  }

  async getBalance(account: string, code?: string, symbol?: string) {
    return await this.client.getBalance(account);
  }
}
