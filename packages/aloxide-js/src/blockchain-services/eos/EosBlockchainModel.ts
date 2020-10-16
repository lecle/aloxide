import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { BlockchainAccount } from '../BlockchainAccount';
import { BlockchainAction, BlockchainModel } from '../BlockchainModel';
import { TextEncoder, TextDecoder } from 'util';
import { NetworkConfig } from '../TypeDefinitions';
import fetch from 'node-fetch';

export class EosBlockchainModel extends BlockchainModel {
  protected client: Api;

  constructor(
    name: string,
    protected account: BlockchainAccount,
    public contract: string,
    protected url: string,
    actions: BlockchainAction[],
  ) {
    super(name, account, url, actions);

    const signatureProvider = new JsSignatureProvider([this.account.privateKey]);
    const rpc = new JsonRpc(url, { fetch });

    this.client = new Api({
      rpc,
      signatureProvider,
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder(),
    });
  }

  async get(id: string): Promise<any> {
    const methodName = 'get';
    this.validateParams({ id }, this.name, false);

    const res = await this.client.rpc.get_table_rows({
      json: true,
      code: this.contract,
      scope: this.account.name,
      table: this.name,
      limit: 1,
      reverse: false,
      show_payer: false,
      key_type: 'i64',
      lower_bound: id,
      upper_bound: id,
    });

    return res.rows[0];
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

  async add(params: any): Promise<any> {
    const actionName = `cre${this.name}`;
    if (!params.user) {
      params.user = this.account.name;
    }
    const validatedParams = this.validateParams(params, actionName, false);
    const res = await this._sendTransaction(actionName, validatedParams);

    return res.transaction_id;
  }

  async update(id: string, params: any): Promise<any> {
    const actionName = `upd${this.name}`;
    if (!params.user) {
      params.user = this.account.name;
    }
    const validatedParams = this.validateParams(params, actionName, false);
    const res = await this._sendTransaction(actionName, validatedParams);

    return res.transaction_id;
  }

  async delete(id: string, user?: string): Promise<any> {
    const actionName = `del${this.name}`;
    const params: any = { id };
    if (!user) {
      params.user = this.account.name;
    }
    const validatedParams = this.validateParams(params, actionName, false);
    const res = await this._sendTransaction(actionName, validatedParams);

    return res.transaction_id;
  }
}
