import { Block, BlockInfo } from 'demux';

import { hexPropToNumber } from './hexToNumber';
import { toNumber } from './toNumber';

import type Logger from 'bunyan';
import type { IconAction } from './IconAction';
import type { Jsonrpc20 } from './Jsonrpc20';
import type { IconRawBlock } from './IconRawBlock';
import type { IconTransaction } from './IconTransaction';
export class IconBlock implements Block {
  public actions: IconAction[];
  public blockInfo: BlockInfo;
  constructor(rawBlock: Jsonrpc20<IconRawBlock>, protected log: Logger) {
    const { result } = rawBlock;
    this.blockInfo = {
      blockNumber: result.height,
      blockHash: result.block_hash,
      previousBlockHash: result.prev_block_hash,
      timestamp: new Date(Math.floor(toNumber(result.time_stamp) / 1000)),
    };

    this.actions = this.collectActionsFromBlock(rawBlock);
  }

  protected collectActionsFromBlock(rawBlock: Jsonrpc20<IconRawBlock>): IconAction[] {
    const { result } = rawBlock;
    return result.confirmed_transaction_list
      .map<IconAction>((transaction: IconTransaction, actionIndex) => {
        const { txHash, version, dataType, to, data: { method, params } = {} } = transaction;

        if (dataType != 'call') {
          // TODO handle other data type
          this.log.debug('---- ignore data type:', dataType);
          return null;
        }

        const iconAction: IconAction = {
          type: `${to}::${method}`,
          payload: {
            ...transaction,
            producer: result.peer_id,
            transactionId: txHash,
            actionIndex,
            data: hexPropToNumber(params),
            version,
          },
        };

        return iconAction;
      })
      .filter(n => !!n /* remove null items */);
  }
}
