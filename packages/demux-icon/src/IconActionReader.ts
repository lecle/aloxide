import { AbstractActionReader, NotInitializedError } from 'demux';
import fetch from 'node-fetch';
import { RetrieveBlockError, RetrieveHeadBlockError, RetrieveIrreversibleBlockError } from './errors';
import { IconBlock } from './IconBlock';
import { Jsonrpc20 } from './Jsonrpc20';
import { retry } from './utils';

import type { IconActionReaderOptions } from './IconActionReaderOptions';
export class IconActionReader extends AbstractActionReader {
  protected endpoint: string;
  protected nid: number;
  protected jsonrpc: string;

  constructor(options: IconActionReaderOptions = {}) {
    super(options);
    const endpoint = options.endpoint
      ? options.endpoint
      : 'https://bicon.net.solidwallet.io/api/v3';
    this.endpoint = endpoint.replace(/\/+$/g, ''); // Removes trailing slashes
    this.nid = options.nid || 3;
    this.jsonrpc = options.jsonrpc || '2.0';
  }

  public post(data: { [key: string]: any }): Promise<Jsonrpc20<any>> {
    return fetch(this.endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
  }

  public getLastBlock(): Promise<Jsonrpc20<any>> {
    return this.post({
      jsonrpc: this.jsonrpc,
      method: 'icx_getLastBlock',
      id: this.nid,
    });
  }

  /**
   * Returns a promise for the head block number.
   */
  public async getHeadBlockNumber(
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<number> {
    try {
      const blockNum = await retry(
        async () => {
          const blockInfo = await this.getLastBlock();
          return blockInfo.result.height;
        },
        numRetries,
        waitTimeMs,
      );
      return blockNum;
    } catch (err) {
      throw new RetrieveHeadBlockError();
    }
  }

  public async getLastIrreversibleBlockNumber(
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<number> {
    try {
      const irreversibleBlockNum = await retry(
        async () => {
          const blockInfo = await this.getLastBlock();
          return blockInfo.result.height;
        },
        numRetries,
        waitTimeMs,
      );

      return irreversibleBlockNum;
    } catch (err) {
      this.log.error(err);
      throw new RetrieveIrreversibleBlockError();
    }
  }

  /**
   * Returns a promise for a `NodeosBlock`.
   */
  public async getBlock(
    blockNumber: number,
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<IconBlock> {
    try {
      const block = await retry(
        async () => {
          const rawBlock = await this.post({
            jsonrpc: this.jsonrpc,
            method: 'icx_getBlockByHeight',
            id: this.nid,
            params: {
              height: `0x${blockNumber.toString(16)}`,
            },
          });
          return new IconBlock(rawBlock, this.log);
        },
        numRetries,
        waitTimeMs,
      );

      return block;
    } catch (err) {
      this.log.error(err);
      throw new RetrieveBlockError();
    }
  }

  protected async setup(): Promise<void> {
    try {
      await this.getLastBlock();
    } catch (err) {
      throw new NotInitializedError('Cannot reach supplied icon endpoint.', err);
    }
  }
}
