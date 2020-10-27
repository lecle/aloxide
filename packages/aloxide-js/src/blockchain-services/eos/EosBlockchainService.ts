import fetch from 'node-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider, PrivateKey } from 'eosjs/dist/eosjs-jssig';

import { BlockchainService } from '../BlockchainService';
import { ContractPath, NetworkConfig } from '../TypeDefinitions';
import { readABIFile, readWASMFile } from '../../helpers/contract-files-reader';
import { BlockchainAccount } from '../BlockchainAccount';
import { BlockchainModel } from '../BlockchainModel';
import { EosBlockchainModel } from './EosBlockchainModel';

export class EosBlockchainService extends BlockchainService {
  client: Api;

  constructor(config: NetworkConfig) {
    super(config);
    const signatureProvider = new JsSignatureProvider([]);
    const rpc = new JsonRpc(this.url(), { fetch });

    this.client = new Api({
      rpc,
      signatureProvider,
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder(),
    });
  }

  async deployContract(contractPath: ContractPath, account: BlockchainAccount) {
    const { abiPath, wasmPath } = contractPath;
    const { name: accountName, privateKey: privKey } = account;
    const signatureProvider = (this.client.signatureProvider as unknown) as JsSignatureProvider;

    // Add key to Signature Provider
    const priv = PrivateKey.fromString(privKey);
    const pubKey = priv.getPublicKey().toString();

    signatureProvider.keys.set(pubKey, priv.toElliptic());
    signatureProvider.availableKeys.push(pubKey);

    const abi = readABIFile(abiPath, this.client);
    const wasm = readWASMFile(wasmPath);

    const trx = await this.client.transact(
      {
        actions: [
          {
            account: 'eosio',
            name: 'setcode',
            authorization: [
              {
                actor: accountName,
                permission: 'active',
              },
            ],
            data: {
              account: accountName,
              code: wasm,
              vmtype: 0,
              vmversion: 0,
            },
          },
          {
            account: 'eosio',
            name: 'setabi',
            authorization: [
              {
                actor: accountName,
                permission: 'active',
              },
            ],
            data: {
              account: accountName,
              abi,
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    );

    return trx;
  }

  async getBalance(account: string, code: string, symbol: string): Promise<any> {
    if (!code || !symbol) {
      throw new Error('"Code" and "Symbol" are needed when getting balance from EOS Network');
    }

    return await this.client.rpc.get_currency_balance(code, account, symbol);
  }

  async createModel(
    entityName: string,
    contract: string,
    account?: BlockchainAccount,
  ): Promise<BlockchainModel> {
    entityName = entityName.toLocaleLowerCase();
    const modelAbi = await this.client.rpc.get_abi(contract);
    const actionsList = modelAbi.abi.structs;
    const bcToJsType = type => {
      switch (type) {
        case 'name':
        case 'string':
          return 'string';
        case 'uint64':
        case 'float64':
          return 'number';
      }
    };
    const actions = actionsList.reduce((accumulator, action) => {
      // check if action name contain the entity name as last word. ex: checking poll
      // createpoll -> true
      // createpollandvote -> false
      if (action.name.lastIndexOf(entityName) === action.name.length - entityName.length) {
        if (action.name === entityName) {
          // workaround for the `poll` action on EOS
          accumulator.push({
            name: action.name,
            inputs: [
              {
                name: 'id',
                type: 'number',
              },
            ],
          });
        } else {
          accumulator.push({
            name: action.name,
            inputs: action.fields.map(input => ({
              name: input.name,
              type: bcToJsType(input.type),
            })),
          });
        }
      }

      return accumulator;
    }, []);

    return new EosBlockchainModel(entityName, this.url(), actions, contract, account);
  }
}
