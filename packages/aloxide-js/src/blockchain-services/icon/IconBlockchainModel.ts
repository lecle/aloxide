import IconService, {
  HttpProvider,
  IconWallet,
  IconBuilder,
  IconConverter,
  SignedTransaction,
  BigNumber,
} from 'icon-sdk-js';
import { checkSingleKey } from '../../helpers/has-single-key';
import { BlockchainAccount } from '../BlockchainAccount';
import { BlockchainAction, BlockchainModel } from '../BlockchainModel';

export class IconBlockchainModel extends BlockchainModel {
  client: IconService;

  constructor(
    name: string,
    url: string,
    actions: BlockchainAction[],
    contract: string,
    account?: BlockchainAccount,
  ) {
    super(name, url, actions, contract, account);

    this.client = new IconService(new HttpProvider(url));
  }

  /**
   *
   * @param methodName
   * @param params
   * @returns transaction id of the called action
   */
  async _sendCallTransaction(methodName, params): Promise<string> {
    const wallet = IconWallet.loadPrivateKey(this.account.privateKey);
    const defaultStepLimit = await this._getMaxLimit();
    const transaction = new IconBuilder.CallTransactionBuilder()
      .from(wallet.getAddress())
      .to(this.contract)
      .stepLimit(defaultStepLimit)
      .nid(IconConverter.toBigNumber('3'))
      .nonce(IconConverter.toBigNumber('1'))
      .version(IconConverter.toBigNumber('3'))
      .timestamp(new Date().getTime() * 1000)
      .method(methodName)
      .params(params)
      .build();

    const signedTransaction = new SignedTransaction(transaction, wallet);
    const trxId = await this.client.sendTransaction(signedTransaction).execute();

    return trxId;
  }

  async _getMaxLimit(): Promise<BigNumber> {
    const governanceApi = await this.client
      .getScoreApi('cx0000000000000000000000000000000000000001')
      .execute();
    const methodName = 'getMaxStepLimit';
    const getMaxStepLimitApi = governanceApi.getMethod(methodName);
    const params = {
      [getMaxStepLimitApi.inputs[0].name]: 'invoke',
    };
    const callBuilder = new IconBuilder.CallBuilder();
    const call = callBuilder
      .to('cx0000000000000000000000000000000000000001')
      .method(methodName)
      .params(params)
      .build();
    const maxStepLimit = await this.client.call(call).execute();

    return IconConverter.toBigNumber(maxStepLimit);
  }

  async get(key: { [key: string]: any }): Promise<object> {
    checkSingleKey(key);
    const methodName = `get${this.name}`;
    const validatedParams = this.validateParams(key, methodName, false);
    const callBuilder = new IconBuilder.CallBuilder();
    const call = callBuilder.to(this.contract).method(methodName).params(validatedParams).build();
    const res = await this.client.call(call).execute();

    if (res) {
      return JSON.parse(res);
    }
  }

  async add(params: object): Promise<string> {
    const methodName = `cre${this.name}`;
    const validatedParams = this.validateParams(params, methodName, false);
    const res = await this._sendCallTransaction(methodName, validatedParams);

    return res;
  }

  async update(key: { [key: string]: any }, params: any): Promise<string> {
    checkSingleKey(key);
    params = {
      ...params,
      ...key,
    };
    const methodName = `upd${this.name}`;
    const validatedParams = this.validateParams(params, methodName, false);
    const res = await this._sendCallTransaction(methodName, validatedParams);

    return res;
  }

  async delete(key: { [key: string]: any }): Promise<any> {
    checkSingleKey(key);

    const methodName = `del${this.name}`;
    const validatedParams = this.validateParams(key, methodName, false);
    const res = await this._sendCallTransaction(methodName, validatedParams);

    return res;
  }
}
