<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Package `example-demux`](#package-example-demux)
  - [Explain](#explain)
    - [Smart-contract](#smart-contract)
    - [Sample data](#sample-data)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Package `example-demux`

Example of `@aloxide/demux`.

1. Test on 3 blockchains: EOS, CAN, and ICON
   1. Use Aloxide to generate a smart-contract for those blockchains using the same Aloxide configuration.
   2. Generate a bunch of sample data and push to those smart-contract.
2. Sync data from those blockchains to centralized databases
   1. There will be 4 database systems used: Postgres, MySql, MongoDb, DynamoDb
   2. Setup demux pattern so that smart-contract data will be simultaneously indexed to those 4 databases

## Explain

### Smart-contract

Smart-contract which is generatedd is a simple poll which include three tables:

1. `Poll` table holds requested polls: `pollId`, `name` (short description), `body` (long description), `start`, `end`
2. `Option` table holds available options of a poll: `optionId`, `name` (description), `pollId`
3. `Vote` talbe holds votes from users: `voteId`, `point`, `message` (optional message), `ownerId`, `optionId`

To generate smart-contract from above design. We need to contruct an [Aloxide configuration](./aloxide.yml):

```yaml
entities:
  - name: Poll
    fields:
      - name: pollId
        type: uint64_t
      - name: name
        type: string
      - name: body
        type: string
      - name: start
        type: uint64_t
      - name: end
        type: uint64_t
    key: pollId
  - name: Option
    fields:
      - name: optionId
        type: uint64_t
      - name: name
        type: string
      - name: pollId
        type: uint64_t
    key: optionId
  - name: Vote
    fields:
      - name: voteId
        type: uint64_t
      - name: point
        type: number
      - name: message
        type: string
      - name: ownerId
        type: uint64_t
      - name: optionId
        type: uint64_t
    key: voteId
```

- [Build and deploy smart-contract guide](./docs/build-and-deploy-smart-contract.md)

### Sample data

Our user case starts with a group has 5 members. They want to have a trip after a long boring social distance because of the pandemic.
They have two things that need to decide two things: where to go since they have three options: Vietnam, Thailand, or Singapore, and when to go
since they have two options: October 2nd or December 30th. These decisions must be made before September 29th. With these inputs, we have data represents in JSON format as bellow:

```json
[
  {
    "pollId": 1001,
    "name": "Let's have happy time together.",
    "body": "We have three options. Where should we go?",
    "start": "September 21st",
    "end": "September 29th",
    "options": [
      {
        "optionId": 10001,
        "name": "Vietname"
      },
      {
        "optionId": 10003,
        "name": "Thailand"
      },
      {
        "optionId": 10004,
        "name": "Singapore"
      }
    ]
  },
  {
    "pollId": 2001,
    "name": "Let's have a happy time together.",
    "body": "When should we go? There are two periods which we can choose from.",
    "start": "September 21st",
    "end": "September 29th",
    "options": [
      {
        "optionId": 20001,
        "name": "October 2nd"
      },
      {
        "optionId": 20002,
        "name": "December 30th"
      }
    ]
  }
]
```

Besides those two sample polls above, I will generate 10 more dummy polls. These data will be posted directly to the blockchain.
Since smart-contract on the blockchain is also called a decentralized application (DApp), data can be a push from anywhere: command-line tools, webs, third-party applicationd, mobile applications... Our Aloxide will help set up a simple way to sync those data from the blockchain to centralized databases so that, we can do some complicated queries.

- How many members have participated in the poll?
- Which option is likely a potential one?

## Usage

```
const exampleDemux = require('example-demux');

// TODO: DEMONSTRATE API
```
