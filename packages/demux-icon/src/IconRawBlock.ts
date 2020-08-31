import { IconTransaction, IconBaseTransaction } from './IconTransaction';
import { Hex } from './Hex';

export interface IconRawBlock<Data = any> {
  version: string;
  height: number;
  signature: string;
  prev_block_hash: string;
  merkle_tree_root_hash: string;
  time_stamp: number;
  confirmed_transaction_list: (IconTransaction<Data> | IconBaseTransaction)[];
  block_hash: string;
  peer_id: Hex;
  next_leader: Hex;
}
