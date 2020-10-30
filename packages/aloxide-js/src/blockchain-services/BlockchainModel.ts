import { BlockchainAccount } from '../blockchain-services/BlockchainAccount';

export abstract class BlockchainModel {
  public readonly name: string;
  public readonly url: string;
  public readonly actions: BlockchainAction[];
  public readonly contract: string;
  public account: BlockchainAccount;

  constructor(
    name: string,
    url: string,
    actions: BlockchainAction[],
    contract: string,
    account?: BlockchainAccount,
  ) {
    this.name = name.toLocaleLowerCase();
    this.url = url;
    this.actions = actions;
    this.contract = contract;

    if (account instanceof BlockchainAccount) {
      this.account = account;
    }
  }

  /**
   * Set default account for the model
   * @param account
   */
  protected configureAccount(account: string | BlockchainAccount): BlockchainAccount {
    if (!(account instanceof BlockchainAccount) && typeof account != 'string') {
      throw new Error('Account must be a Private Key string or an instance of Blockchain Account!');
    }

    if (typeof account === 'string') {
      account = new BlockchainAccount(account);
    }

    this.account = account;
    return this.account;
  }

  getAction(name: string): BlockchainAction {
    if (!name) {
      throw new Error('Action Name must be required!');
    }

    const action = this.actions.find(a => {
      if (a.name === name) return a;
    });

    if (!action) {
      throw new Error(`The Action named ${name} does not exist`);
    }

    return action;
  }

  validateParams(params: object, actionName: string): any {
    // Remove prototype props to not use them
    const value = Object.assign({}, params);

    const { inputs: inputSchema } = this.getAction(actionName);
    const valueKeys = Object.keys(value);

    // Only check as if param is acceptable
    const inputParamNames = inputSchema.map(input => input.name);
    const res = valueKeys.reduce((accumulator, key) => {
      if (inputParamNames.indexOf(key) !== -1) {
        accumulator[key] = value[key];
      }

      return accumulator;
    }, {});

    return res;
  }

  abstract async get(key: { [key: string]: any }): Promise<object>;

  abstract async add(params: object): Promise<any>;

  abstract async update(key: { [key: string]: any }, params: object): Promise<any>;

  abstract async delete(key: { [key: string]: any }, user?: string): Promise<any>;
}

export type BlockchainAction = {
  name: string;
  inputs: BlockchainActionInput[];
};

type BlockchainActionInput = {
  name: string;
  type: string;
};
