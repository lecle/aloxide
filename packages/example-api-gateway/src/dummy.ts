import './loadEnv';

import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import faker from 'faker';
import fetch from 'node-fetch';
import { TextDecoder, TextEncoder } from 'util';

const signatureProvider = new JsSignatureProvider([process.env.app_d_private_key]);
const rpc = new JsonRpc(process.env.app_nodeosEndpoint, { fetch });
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

const eosAccountName = process.env.app_d_eos_account_name || 'helloworld12';

async function cleanUpEos() {
  const h = async (n: 'poll' | 'vote') => {
    while (true) {
      const s = await rpc
        .get_table_rows({
          json: true,
          code: eosAccountName,
          scope: eosAccountName,
          table: n,
          limit: 100,
        })
        .then(res => {
          const rows = res?.rows || [];
          if (!rows.length) return 'stop';

          for (const { id } of rows) {
            api.transact(
              {
                actions: [
                  {
                    account: eosAccountName,
                    name: `del${n}`,
                    authorization: [
                      {
                        actor: eosAccountName,
                        permission: 'active',
                      },
                    ],
                    data: {
                      user: eosAccountName,
                      id,
                    },
                  },
                ],
              },
              {
                blocksBehind: 3,
                expireSeconds: 30,
              },
            );
          }
          return 'continue';
        });

      if (s == 'stop') break;
    }
  };

  await h('vote');
  await h('poll');
}

async function dummy() {
  // create poll
  const N_POLL = 100;
  const polls = new Array(N_POLL);
  for (let i = 0; i < N_POLL; i++) {
    const N_VOTE = faker.random.number({ min: 0, max: 20 });

    const p = (polls[i] = {
      id: i + 1,
      name: faker.name.title(),
      body: faker.lorem.paragraph().substr(0, 255),
      votes: new Array(N_VOTE),
    });

    // create vote
    for (let j = 0; j < N_VOTE; j++) {
      p.votes[j] = {
        id: parseInt(`${p.id}${j}`, 10),
        pollId: p.id,
        ownerId: faker.random.number({ min: 1, max: 100 }),
        point: faker.random.number({ min: 0, max: 10 }),
      };
    }
  }

  for (const poll of polls) {
    await api
      .transact(
        {
          actions: [
            {
              account: eosAccountName,
              name: 'crepoll',
              authorization: [
                {
                  actor: eosAccountName,
                  permission: 'active',
                },
              ],
              data: {
                user: eosAccountName,
                id: poll.id,
                name: poll.name,
                body: poll.body,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      .then(trx => {
        logger.debug('-- trx?.transaction_id:', trx?.transaction_id);
        logger.debug('-- trx?.processed?.block_num:', trx?.processed?.block_num);
      });

    for (const vote of poll.votes) {
      await api
        .transact(
          {
            actions: [
              {
                account: eosAccountName,
                name: 'crevote',
                authorization: [
                  {
                    actor: eosAccountName,
                    permission: 'active',
                  },
                ],
                data: {
                  user: eosAccountName,
                  id: vote.id,
                  pollId: vote.pollId,
                  ownerId: vote.ownerId,
                  point: vote.point,
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          },
        )
        .then(trx => {
          logger.debug('-- trx?.transaction_id:', trx?.transaction_id);
          logger.debug('-- trx?.processed?.block_num:', trx?.processed?.block_num);
        });
    }
  }
}

dummy().catch(err => {
  logger.error('---- dummy:', err);
});
