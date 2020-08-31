import type { ActionReaderOptions } from 'demux';

export interface IconActionReaderOptions extends ActionReaderOptions {
  endpoint?: string;
  /**
   * Icon network id
   */
  nid?: number;

  jsonrpc?: string;
}
