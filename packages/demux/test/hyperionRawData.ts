export const hyperionRawBlock = {
  query_time_ms: 12.014,
  id: '01a808454f3aa21a1602478e2dbdbc5ebf0b735b226cdc344ea4e4a9d7141276',
  number: 27789381,
  previous_id: '01a80844388a2285339b279b14cd25cb32e905edfeb2895a7e47b5c8e1da99dd',
  status: 'irreversible',
  timestamp: '2020-11-26T04:24:13.000',
  producer: 'test3.bp',
  transactions: [
    {
      id: '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      actions: [
        {
          receiver: 'cpu',
          account: 'cpu',
          action: 'freecpunet',
          authorization: [
            {
              account: 'cpu',
              permission: 'active'
            }
          ],
          data: {
            to: 'iyeqsiu44wv4',
            memo: 'pay cpu and net'
          }
        },
        {
          receiver: 'eosio.token',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            'quantity': '0.1123 CAT'
          }
        },
        {
          receiver: 'iyeqsiu44wv4',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receiver: '511nh3eth2bq',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permissio: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receive: 'eosio.token',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receiver: 'iyeqsiu44wv4',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receiver: 'yxgqwv4yrtxx',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receiver: 'eosio.token',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receiver: 'iyeqsiu44wv4',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active'
            }
          ],
          data: {
            quantity: '0.1123 CAT'
          }
        },
        {
          receiver: 'mzyqfirhysjn',
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              account: 'iyeqsiu44wv4',
              permission: 'active',
            }
          ],
          data: {
            quantity: '0.1123 CAT',
          }
        }
      ]
    }
  ]
};

export const hyperionRawTransaction = {
  'executed': true,
  'trx_id': '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
  'lib': 27962634,
  'actions': [
    {
      'action_ordinal': 1,
      'creator_action_ordinal': 0,
      'act': {
        'account': 'cpu',
        'name': 'freecpunet',
        'authorization': [
          {
            'actor': 'cpu',
            'permission': 'active'
          }
        ],
        'data': {
          'to': 'iyeqsiu44wv4',
          'memo': 'pay cpu and net'
        }
      },
      'context_free': false,
      'elapsed': '0',
      '@timestamp': '2020-11-26T04:24:13.000',
      'block_num': 27789381,
      'producer': 'test3.bp',
      'trx_id': '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      'global_sequence': 27863444,
      'cpu_usage_us': 558,
      'net_usage_words': 44,
      'signatures': [
        'SIG_K1_Jugie45hLE2i9ohMQWorfG2CbY6Ksd4psqTmwRCHwWajHEhoyuBpYkZcD79iq52iDtWvmCmgNk1cGVZMvc91bLggsM9CzN',
        'SIG_K1_Jwp8qcrA8zQzng9wgpuRR4ipnydaodUEsMbjkYx4xPPTgGAkFzeeFLtxSxyCjQgzjvCjgQchHccsVkbx88DefbmKGBdyXE'
      ],
      'inline_count': 9,
      'inline_filtered': false,
      'receipts': [
        {
          'receiver': 'cpu',
          'global_sequence': '27863444',
          'recv_sequence': '15774',
          'auth_sequence': [
            {
              'account': 'cpu',
              'sequence': '19652'
            }
          ]
        }
      ],
      'code_sequence': 1,
      'abi_sequence': 1,
      'notified': [
        'cpu'
      ],
      'timestamp': '2020-11-26T04:24:13.000'
    },
    {
      'action_ordinal': 2,
      'creator_action_ordinal': 0,
      'act': {
        'account': 'eosio.token',
        'name': 'transfer',
        'authorization': [
          {
            'actor': 'iyeqsiu44wv4',
            'permission': 'active'
          }
        ],
        'data': {
          'from': 'iyeqsiu44wv4',
          'to': '511nh3eth2bq',
          'amount': 0.1123,
          'symbol': 'CAT',
          'memo': 'Heloo',
          'quantity': '0.1123 CAT'
        }
      },
      'context_free': false,
      'elapsed': '0',
      'account_ram_deltas': [
        {
          'account': '511nh3eth2bq',
          'delta': '-128'
        },
        {
          'account': 'iyeqsiu44wv4',
          'delta': '128'
        }
      ],
      '@timestamp': '2020-11-26T04:24:13.000',
      'block_num': 27789381,
      'producer': 'test3.bp',
      'trx_id': '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      'global_sequence': 27863445,
      'receipts': [
        {
          'receiver': 'eosio.token',
          'global_sequence': '27863445',
          'recv_sequence': '5578',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '19'
            }
          ]
        },
        {
          'receiver': 'iyeqsiu44wv4',
          'global_sequence': '27863446',
          'recv_sequence': '24',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '20'
            }
          ]
        },
        {
          'receiver': '511nh3eth2bq',
          'global_sequence': '27863447',
          'recv_sequence': '579',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '21'
            }
          ]
        }
      ],
      'code_sequence': 1,
      'abi_sequence': 1,
      'notified': [
        'eosio.token',
        'iyeqsiu44wv4',
        '511nh3eth2bq'
      ],
      'timestamp': '2020-11-26T04:24:13.000'
    },
    {
      'action_ordinal': 3,
      'creator_action_ordinal': 0,
      'act': {
        'account': 'eosio.token',
        'name': 'transfer',
        'authorization': [
          {
            'actor': 'iyeqsiu44wv4',
            'permission': 'active'
          }
        ],
        'data': {
          'from': 'iyeqsiu44wv4',
          'to': 'yxgqwv4yrtxx',
          'amount': 0.1123,
          'symbol': 'CAT',
          'memo': 'Heloo',
          'quantity': '0.1123 CAT'
        }
      },
      'context_free': false,
      'elapsed': '0',
      '@timestamp': '2020-11-26T04:24:13.000',
      'block_num': 27789381,
      'producer': 'test3.bp',
      'trx_id': '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      'global_sequence': 27863448,
      'receipts': [
        {
          'receiver': 'eosio.token',
          'global_sequence': '27863448',
          'recv_sequence': '5579',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '22'
            }
          ]
        },
        {
          'receiver': 'iyeqsiu44wv4',
          'global_sequence': '27863449',
          'recv_sequence': '25',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '23'
            }
          ]
        },
        {
          'receiver': 'yxgqwv4yrtxx',
          'global_sequence': '27863450',
          'recv_sequence': '29',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '24'
            }
          ]
        }
      ],
      'code_sequence': 1,
      'abi_sequence': 1,
      'notified': [
        'eosio.token',
        'iyeqsiu44wv4',
        'yxgqwv4yrtxx'
      ],
      'timestamp': '2020-11-26T04:24:13.000'
    },
    {
      'action_ordinal': 4,
      'creator_action_ordinal': 0,
      'act': {
        'account': 'eosio.token',
        'name': 'transfer',
        'authorization': [
          {
            'actor': 'iyeqsiu44wv4',
            'permission': 'active'
          }
        ],
        'data': {
          'from': 'iyeqsiu44wv4',
          'to': 'mzyqfirhysjn',
          'amount': 0.1123,
          'symbol': 'CAT',
          'memo': 'Heloo',
          'quantity': '0.1123 CAT'
        }
      },
      'context_free': false,
      'elapsed': '0',
      '@timestamp': '2020-11-26T04:24:13.000',
      'block_num': 27789381,
      'producer': 'test3.bp',
      'trx_id': '637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2',
      'global_sequence': 27863451,
      'receipts': [
        {
          'receiver': 'eosio.token',
          'global_sequence': '27863451',
          'recv_sequence': '5580',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '25'
            }
          ]
        },
        {
          'receiver': 'iyeqsiu44wv4',
          'global_sequence': '27863452',
          'recv_sequence': '26',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '26'
            }
          ]
        },
        {
          'receiver': 'mzyqfirhysjn',
          'global_sequence': '27863453',
          'recv_sequence': '28',
          'auth_sequence': [
            {
              'account': 'iyeqsiu44wv4',
              'sequence': '27'
            }
          ]
        }
      ],
      'code_sequence': 1,
      'abi_sequence': 1,
      'notified': [
        'eosio.token',
        'iyeqsiu44wv4',
        'mzyqfirhysjn'
      ],
      'timestamp': '2020-11-26T04:24:13.000'
    }
  ],
  'query_time_ms': 31.314
};

export const hyperionActionMeta = [
  {
    "receiver": "cpu",
    "account": "cpu",
    "action": "freecpunet",
    "authorization": [
      {
        "account": "cpu",
        "permission": "active"
      }
    ],
    "data": {
      "to": "iyeqsiu44wv4",
      "memo": "pay cpu and net"
    }
  },
  {
    "receiver": "eosio.token",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "511nh3eth2bq",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "iyeqsiu44wv4",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "511nh3eth2bq",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "511nh3eth2bq",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "511nh3eth2bq",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "eosio.token",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "yxgqwv4yrtxx",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "iyeqsiu44wv4",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "yxgqwv4yrtxx",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "yxgqwv4yrtxx",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "yxgqwv4yrtxx",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "eosio.token",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "mzyqfirhysjn",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "iyeqsiu44wv4",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "mzyqfirhysjn",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  },
  {
    "receiver": "mzyqfirhysjn",
    "account": "eosio.token",
    "action": "transfer",
    "authorization": [
      {
        "account": "iyeqsiu44wv4",
        "permission": "active"
      }
    ],
    "data": {
      "from": "iyeqsiu44wv4",
      "to": "mzyqfirhysjn",
      "amount": 0.1123,
      "symbol": "CAT",
      "memo": "Heloo",
      "quantity": "0.1123 CAT"
    }
  }
];

export const processedBlockMeta = {
  "query_time_ms": 12.014,
  "id": "01a808454f3aa21a1602478e2dbdbc5ebf0b735b226cdc344ea4e4a9d7141276",
  "number": 27789381,
  "previous_id": "01a80844388a2285339b279b14cd25cb32e905edfeb2895a7e47b5c8e1da99dd",
  "status": "irreversible",
  "timestamp": "2020-11-26T04:24:13.000",
  "producer": "test3.bp",
  "transactions": [
    {
      "id": "637fb1f1fb82d903893aedf966ce37880d6ae96031b3acf7466ae8978adbbcc2",
      "actions": hyperionActionMeta,
    }
  ]
}
