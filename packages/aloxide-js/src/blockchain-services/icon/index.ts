import IconService, {
  HttpProvider,
  IconBuilder,
  IconWallet,
  SignedTransaction,
  IconConverter,
} from 'icon-sdk-js';
import { ContractPath, NetworkConfig } from '../TypeDefinitions';
import { BlockchainAccount } from '../BlockchainAccount';
import { BlockchainService } from '../BlockchainService';
import { readPSFile } from '../../helpers/contract-files-reader';
import { BlockchainModel } from '../BlockchainModel';
import { IconBlockchainModel } from './IconBlockchainModel';

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
    const pyContent = readPSFile(psPath);
    return this.processDeployment(pyContent, account, opts.params);
  }

  private async processDeployment(
    contractContent: any,
    account: BlockchainAccount,
    params: object,
  ) {
    const wallet = IconWallet.loadPrivateKey(account.privateKey);
    const transaction = await this.buildDeployTransaction(
      contractContent,
      params,
      wallet.getAddress(),
    );
    const signedTransaction = await this.signedTransaction(transaction, wallet);
    return await this.pushTransaction(signedTransaction);
  }

  private async buildDeployTransaction(content: any, params: object, address: string) {
    const contentType = 'application/zip';

    const stepLimit = await this.getMaxStepLimit();
    const networkId = IconConverter.toBigNumber(3);
    const version = IconConverter.toBigNumber(3);
    const timestamp = new Date().getTime() * 1000;
    const { DeployTransactionBuilder } = IconBuilder;

    const deployTransactionBuilder = new DeployTransactionBuilder();
    const transaction = deployTransactionBuilder
      .nid(networkId)
      .from(address)
      // .to('cx0000000000000000000000000000000000000000')
      .to('cx26d2757d45ea7e559940d86761330005b0e9f2d8')
      .stepLimit(stepLimit)
      .timestamp(timestamp)
      .contentType(contentType)
      .content(`0x${content}`)
      .params(params)
      .version(version)
      .build();
    return transaction;
  }

  private async signedTransaction(transaction: any, wallet: InstanceType<typeof IconWallet>) {
    const signedTransaction = new SignedTransaction(transaction, wallet);
    return signedTransaction;
  }

  async pushTransaction(
    signedTransaction: InstanceType<typeof SignedTransaction>,
  ): Promise<string> {
    const txHash = await this.client.sendTransaction(signedTransaction).execute();

    return txHash;
  }

  async getMaxStepLimit() {
    const { CallBuilder } = IconBuilder;
    const governanceApi = await this.client
      .getScoreApi('cx0000000000000000000000000000000000000001')
      .execute();
    const methodName = 'getMaxStepLimit';
    const getMaxStepLimitApi = governanceApi.getMethod(methodName);
    const params = {
      [getMaxStepLimitApi.inputs[0].name]: 'invoke',
    };
    const callBuilder = new CallBuilder();
    const call = callBuilder
      .to('cx0000000000000000000000000000000000000001')
      .method(methodName)
      .params(params)
      .build();
    const maxStepLimit = await this.client.call(call).execute();

    return IconConverter.toBigNumber(maxStepLimit);
  }

  async getBalance(account: string, code?: string, symbol?: string) {
    return await this.client.getBalance(account);
  }

  async model(
    entityName: string,
    account: BlockchainAccount,
    contract: string,
  ): Promise<BlockchainModel> {
    entityName = entityName.toLocaleLowerCase();
    const modelAbi = await this.client
      .getScoreApi('cx26d2757d45ea7e559940d86761330005b0e9f2d8')
      .execute();
    const actionsList = modelAbi.getList();
    const bcToJsType = type => {
      switch (type) {
        case 'int':
          return 'number';
        case 'str':
          return 'string';
        default:
          return;
      }
    };
    // Build Blockchain Action Input
    const actions = actionsList.reduce((accumulator, action) => {
      if (action.name.lastIndexOf(entityName) === action.name.length - entityName.length) {
        accumulator.push({
          name: action.name,
          inputs: action.inputs.map(input => ({
            name: input.name,
            type: bcToJsType(input.type),
          })),
        });
      }

      return accumulator;
    }, []);

    return new IconBlockchainModel(entityName, account, contract, this.url(), actions);
  }
}
