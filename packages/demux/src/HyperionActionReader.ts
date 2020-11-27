import * as http from 'http';
import * as https from 'https';
import { AbstractActionReader, NotInitializedError, ActionReaderOptions } from 'demux';
import fetch from 'node-fetch';
import { retry } from './utils';
import { HyperionBlock } from './HyperionBlock';

export interface HyperionActionReaderOptions extends ActionReaderOptions {
  hyperionEndpoint?: string;
}

/**
 * Reads from an hyperion node to get blocks of actions.
 * deferred transactions and inline actions will be included,
 */
export class HyperionActionReader extends AbstractActionReader {
  protected hyperionEndpoint: string;
  protected httpAgent: http.Agent;
  protected httpsAgent: https.Agent;

  constructor(options: HyperionActionReaderOptions = {}) {
    super(options);
    const hyperionEndpoint = options.hyperionEndpoint
      ? options.hyperionEndpoint
      : 'http://localhost:8888';
    this.hyperionEndpoint = hyperionEndpoint.replace(/\/+$/g, ''); // Removes trailing slashes
  }

  /**
   * Returns a http/https agent use to request.
   * create new agent if not existed
   */
  private getConnectionAgent(_parsedURL) {
    if (_parsedURL.protocol === 'http:') {
      if (!this.httpAgent) {
        this.httpAgent = new http.Agent({
          keepAlive: true,
          keepAliveMsecs: 3000,
        });
      }
      return this.httpAgent;
    } else {
      if (!this.httpsAgent) {
        this.httpsAgent = new https.Agent({
          keepAlive: true,
          keepAliveMsecs: 3000,
        });
      }
      return this.httpsAgent;
    }
  }

  private async processBlockMeta(
    block: any,
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ){
    const processedTransactions = [];
    for (const transaction of block.transactions) {
      if (this.includeMetaAction(transaction)) {
        processedTransactions.push({
          id: transaction.id,
          actions: await this.getActionMeta(transaction.id, numRetries, waitTimeMs),
        })
      } else {
        processedTransactions.push(transaction);
      }
    }

    block.transactions = processedTransactions;
    return block;
  }

  /**
   * get meta data of action.
   */
  private async getActionMeta(
    transactionId: string,
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<any> {
    try {
      const rawTransaction = await retry(
        async () => {
          return await fetch(
            `${this.hyperionEndpoint}/v2/history/get_transaction?id=${transactionId}`,
            {
              method: 'get',
              headers: { 'Content-Type': 'application/json' },
              agent: this.getConnectionAgent.bind(this),
            },
          ).then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(res.statusText);
            }
          });
        },
        numRetries,
        waitTimeMs,
      );

      if (!rawTransaction.actions) {
        return [];
      }

      const actionMeta = [];

      for (const action of rawTransaction.actions) {
        for (const receipt of action.receipts) {
          actionMeta.push({
            receiver: receipt.receiver,
            account: action.act.account,
            action: action.act.name,
            authorization: action.act.authorization.map(auth => {
              return { account: auth.actor, permission: auth.permission };
            }),
            data: action.act.data,
          });
        }
      }

      return actionMeta;

    } catch (err) {
      this.log.error(err);
      throw new Error('Error get action meta, max retries failed');
    }
  }

  private includeMetaAction(transaction: any) {
    for (const action of transaction.actions) {
      if (action.receiver === 'eosio') {
        if (
          action.action === 'newaccount' ||
          action.action === 'updateauth' ||
          action.action === 'unstaketorex' ||
          action.action === 'buyrex' ||
          action.action === 'buyram' ||
          action.action === 'buyrambytes' ||
          action.action === 'undelegatebw' ||
          action.action === 'delegatebw'
        ) {
          return true;
        }
      }

      if (action.action === 'transfer') {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns a promise for the head block number.
   */
  public async getHeadBlockNumber(
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<number> {
    try {
      return await retry(
        async () => {
          const blockInfo = await fetch(`${this.hyperionEndpoint}/v1/chain/get_info`, {
            agent: this.getConnectionAgent.bind(this),
          }).then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(res.statusText);
            }
          });
          return blockInfo.head_block_num;
        },
        numRetries,
        waitTimeMs,
      );
    } catch (err) {
      throw new Error('Error retrieving head block, max retries failed');
    }
  }

  public async getLastIrreversibleBlockNumber(
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<number> {
    try {
      return await retry(
        async () => {
          const blockInfo = await fetch(`${this.hyperionEndpoint}/v1/chain/get_info`, {
            agent: this.getConnectionAgent.bind(this),
          }).then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(res.statusText);
            }
          });
          return blockInfo.last_irreversible_block_num;
        },
        numRetries,
        waitTimeMs,
      );
    } catch (err) {
      this.log.error(err);
      throw new Error('Error retrieving last irreversible block, max retries failed');
    }
  }

  /**
   * Returns a promise for a `NodeosBlock`.
   */
  public async getBlock(
    blockNumber: number,
    numRetries: number = 120,
    waitTimeMs: number = 250,
  ): Promise<HyperionBlock> {
    try {
      const block = await retry(
        async () => {
          return await fetch(`${this.hyperionEndpoint}/v1/trace_api/get_block`, {
            method: 'post',
            body: JSON.stringify({ block_num: blockNumber }),
            headers: { 'Content-Type': 'application/json' },
            agent: this.getConnectionAgent.bind(this),
          }).then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(res.statusText);
            }
          });
        },
        numRetries,
        waitTimeMs,
      );

      const processedBlock = await this.processBlockMeta(block, numRetries, waitTimeMs);
      return new HyperionBlock(processedBlock, this.log);
    } catch (err) {
      this.log.error(err);
      throw new Error('Error block, max retries failed');
    }
  }

  protected async setup(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await fetch(`${this.hyperionEndpoint}/v1/chain/get_info`, {
        agent: this.getConnectionAgent.bind(this),
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      });
    } catch (err) {
      throw new NotInitializedError('Cannot reach supplied nodeos endpoint.', err);
    }
  }
}
