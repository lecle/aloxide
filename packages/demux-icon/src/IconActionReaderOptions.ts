import type { ActionReaderOptions } from 'demux';

export interface IconActionReaderOptions extends ActionReaderOptions {
  endpoint?: string;
  /**
   * Icon network id
   */
  nid?: number;

  jsonrpc?: string;

  /**
   * number of retry on a failure request
   */
  numRetries?: number;

  /**
   * waiting time between retrying
   */
  waitTimeMs?: number;
}
