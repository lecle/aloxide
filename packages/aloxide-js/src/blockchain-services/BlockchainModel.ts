import { BlockchainAccount } from '../blockchain-services/BlockchainAccount';

export abstract class BlockchainModel {
  public readonly name: string;
  public readonly actions: BlockchainAction[];

  constructor(
    name: string,
    protected account: BlockchainAccount,
    protected url: string,
    actions: BlockchainAction[],
  ) {
    this.actions = actions;
    this.account = account;
    this.name = name.toLocaleLowerCase();
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

  validateParams(params: object, actionName: string, strict: boolean = true): any {
    // Remove prototype props to not use them
    const value = Object.assign({}, params);

    const { inputs: inputSchema } = this.getAction(actionName);
    const valueKeys = Object.keys(value);

    // Check param to strictly follow input schema
    if (strict === true) {
      if (inputSchema.length !== valueKeys.length) {
        throw new Error(
          `Expected ${inputSchema.length} arguments (${inputSchema
            .map(input => `"${input.name}"`)
            .join(', ')}), but got ${valueKeys.length}.`,
        );
      }

      inputSchema.forEach(input => {
        if (!value[input.name]) {
          throw new Error(`Argument "${input.name}" was not provided.`);
        }

        if (typeof value[input.name] !== input.type) {
          throw new Error(
            `Argument "${input.name}" was expected to be ${input.type}, but got ${typeof value[
              input.name
            ]}: ${value[input.name]}`,
          );
        }
      });

      return value;
    } else {
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
  }

  abstract async get(id: any): Promise<object>;

  abstract async add(params: object): Promise<any>;

  abstract async update(id: string, params: object): Promise<any>;

  abstract async delete(id: string): Promise<any>;
}

export type BlockchainAction = {
  name: string;
  inputs: BlockchainActionInput[];
};

type BlockchainActionInput = {
  name: string;
  type: string;
};
