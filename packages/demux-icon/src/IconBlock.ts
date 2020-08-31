import { Block, BlockInfo } from 'demux';
import { toNumber } from './toNumber';
import type { Logger } from '@aloxide/logger';
import type { IconAction } from './IconAction';
import type { Jsonrpc20 } from './Jsonrpc20';
import type { IconRawBlock } from './IconRawBlock';
import type { IconTransaction } from './IconTransaction';
export class IconBlock implements Block {
  public actions: IconAction[];
  public blockInfo: BlockInfo;

  constructor(rawBlock: Jsonrpc20<IconRawBlock>, private log: Logger) {
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
      .map<IconAction>((transaction: IconTransaction) => {
        const {
          version,
          dataType,
          to,
          data: { method },
        } = transaction;

        if (dataType != 'call') {
          // TODO handle other data type
          this.log.debug('---- ignore data type:', dataType);
          return null;
        }

        const iconAction: IconAction = {
          type: `${to}::${method}`,
          payload: {
            ...transaction,
            version,
          },
        };

        return iconAction;
      })
      .filter(n => !!n /* remove null items */);
  }
}
