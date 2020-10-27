import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider, PrivateKey } from 'eosjs/dist/eosjs-jssig';
import { BlockchainAccount } from '../BlockchainAccount';
import { BlockchainAction, BlockchainModel } from '../BlockchainModel';
import { TextEncoder, TextDecoder } from 'util';
import fetch from 'node-fetch';
import { checkSingleKey } from '../../helpers/has-single-key';

export class EosBlockchainModel extends BlockchainModel {
  client: Api;

  constructor(
    name: string,
    url: string,
    actions: BlockchainAction[],
    contract: string,
    account?: BlockchainAccount,
  ) {
    super(name, url, actions, contract, account);

    let keys = [];
    if (this.account) {
      keys = [this.account.privateKey];
    }
    const signatureProvider = new JsSignatureProvider(keys);
    const rpc = new JsonRpc(url, { fetch });

    this.client = new Api({
      rpc,
      signatureProvider,
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder(),
    });
  }

  configureAccount(account: string | BlockchainAccount): BlockchainAccount {
    const acc = super.configureAccount(account);
    const signatureProvider = (this.client.signatureProvider as unknown) as JsSignatureProvider;

    // Add key to Signature Provider
    const priv = PrivateKey.fromString(acc.privateKey);
    const pubKey = priv.getPublicKey().toString();

    signatureProvider.keys.set(pubKey, priv.toElliptic());
    signatureProvider.availableKeys.push(pubKey);

    return acc;
  }

  async _sendTransaction(actionName: string, params: object): Promise<any> {
    return await this.client.transact(
      {
        actions: [
          {
            account: this.account.name,
            name: actionName,
            authorization: [
              {
                actor: this.account.name,
                permission: 'active',
              },
            ],
            data: params,
          },
        ],
      },
      {
        expireSeconds: 30,
        blocksBehind: 0,
      },
    );
  }

  async get(key: { [key: string]: any }): Promise<any> {
    checkSingleKey(key);
    const k = Object.keys(key)[0];
    this.validateParams(key, this.name, false);

    const res = await this.client.rpc.get_table_rows({
      json: true,
      code: this.contract,
      scope: this.account?.name,
      table: this.name,
      limit: 1,
      reverse: false,
      show_payer: false,
      key_type: 'i64',
      lower_bound: key[k],
      upper_bound: key[k],
    });

    return res.rows[0];
  }

  async add(params: any): Promise<any> {
    const actionName = `cre${this.name}`;
    if (!params.user) {
      params.user = this.account.name;
    }
    const validatedParams = this.validateParams(params, actionName, false);
    const res = await this._sendTransaction(actionName, validatedParams);

    return res.transaction_id;
  }

  async update(key: { [key: string]: any }, params: any): Promise<any> {
    checkSingleKey(key);
    params = {
      ...params,
      ...key,
    };
    const actionName = `upd${this.name}`;
    if (!params.user) {
      params.user = this.account.name;
    }
    const validatedParams = this.validateParams(params, actionName, false);
    const res = await this._sendTransaction(actionName, validatedParams);

    return res.transaction_id;
  }

  async delete(key: { [key: string]: any }, user?: string): Promise<any> {
    checkSingleKey(key);
    const actionName = `del${this.name}`;
    const params = key;
    if (!user) {
      params.user = this.account.name;
    } else {
      params.user = user;
    }
    const validatedParams = this.validateParams(params, actionName, false);
    const res = await this._sendTransaction(actionName, validatedParams);

    return res.transaction_id;
  }
}
