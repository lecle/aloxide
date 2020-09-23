import { IndexState } from 'demux';

export interface IndexStateModel extends IndexState {
  /**
   * JSON string of a state object
   */
  state: string;

  /**
   * last irreversible block number
   */
  liBlockNumber: number;

  /**
   * last irreversible block hash
   */
  lpBlockHash: string;

  /**
   * last processed block hash
   */
  lpBlockNumber: number;
}
