import * as Logger from 'bunyan';
import { Block, BlockInfo } from 'demux';
import { Action } from 'demux';

export interface EosAuthorization {
  actor: string
  permission: string
}

export interface EosPayload<ActionStruct = any> {
  account: string
  authorization: EosAuthorization[]
  data: ActionStruct
  name: string
  transactionId: string
  actionIndex?: number
  actionOrdinal?: number
  producer?: string
  notifiedAccounts?: string[]
  receiver?: string
  isContextFree?: boolean
  isInline?: boolean
  isNotification?: boolean
  contextFreeData?: Buffer[]
  transactionActions?: TransactionActions
}

export interface EosAction<ActionStruct = any> extends Action {
  payload: EosPayload<ActionStruct>
}

export interface TransactionActions {
  contextFreeActions: EosAction[]
  actions: EosAction[]
  inlineActions: EosAction[]
}

export class HyperionBlock implements Block {
  public actions: EosAction[];
  public blockInfo: BlockInfo;
  constructor(
    rawBlock: any,
    private log: Logger,
  ) {
    this.blockInfo = {
      blockNumber: rawBlock.number,
      blockHash: rawBlock.id,
      previousBlockHash: rawBlock.previous_id,
      timestamp: new Date(rawBlock.timestamp),
    };
    this.actions = this.collectActionsFromBlock(rawBlock);
  }

  protected collectActionsFromBlock(rawBlock: any): EosAction[] {
    const producer = rawBlock.producer;
    return this.flattenArray(rawBlock.transactions.map((transaction: any) => {
      return transaction.actions.map((action: any, actionIndex: number) => {
        const block = {
          type: `${action.receiver}::${action.action}`,
          payload: {
            producer,
            transactionId: transaction.id,
            actionIndex,
            ...action,
          },
        };
        return block
      })
    }))
  }

  private flattenArray(arr: any[]): any[] {
    return arr.reduce((flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten), [])
  }
}
