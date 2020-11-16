import type { ActionCallback, BlockInfo, Updater } from 'demux';
import type { Logger } from './Logger';

export class VersatileUpdater implements Updater {
  #_handlersMap: Map<string, symbol[]> = new Map();
  actionType: string = '*';
  logger?: Logger;

  constructor(options: { logger?: Logger; actionType?: string } = {}) {
    if (typeof options.actionType === 'string') {
      this.actionType = options.actionType;
    }
    this.logger = options.logger;
  }

  apply: ActionCallback = (
    state: any,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
  ): Promise<void> => {
    const actionName = payload.actionType;

    this.handleData(actionName, {
      state,
      payload,
      blockInfo,
      context,
    });
    return Promise.resolve();
  };

  addHandler(
    handler: (data: { state: any; payload: any; blockInfo: BlockInfo; context: any }) => void,
    actionName?: string,
  ) {
    if (typeof handler !== 'function') {
      throw new Error('"handler" is required and must be a function');
    }

    if (!actionName) {
      actionName = this.actionType;
    }

    // TODO: enhance this simple check by using regex.
    if (typeof actionName !== 'string' || actionName.indexOf('::') < 1) {
      throw new Error(
        `"actionName" must be a string and must contain account which this action belong to. Ex: "eosio::${actionName}"`,
      );
    }

    if (this.actionType !== '*' && this.actionType !== actionName) {
      throw new Error(`This Updater is used to handle "${this.actionType}" action only`);
    }

    const handlerMap = this.#_handlersMap;
    const newSymbol = Symbol(actionName);
    this[newSymbol] = handler;

    if (handlerMap.has(actionName)) {
      handlerMap.get(actionName).push(newSymbol);
    } else {
      handlerMap.set(actionName, [newSymbol]);
    }

    return true;
  }

  protected async handleData(actionName: string, data: any, scope?: any): Promise<any> {
    const handlerMap = this.#_handlersMap;
    const handlerSymbols: symbol[] = handlerMap.get(actionName) || [];

    if (handlerSymbols.length === 0) return;

    // Pass custom scope to prevent suspicious handler from modifying real object by .
    scope = scope ? scope : {};
    const handlerCalls = [];

    // Execute all handlers
    for (const symbol of handlerSymbols) {
      handlerCalls.push(this[symbol].call(scope, data));
    }

    return Promise.all(handlerCalls);
  }
}
