<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Package `example-demux`](#package-example-demux)
  - [Explain](#explain)
    - [Smart-contract](#smart-contract)
    - [Sample data](#sample-data)
  - [Usage](#usage)
    - [Prerequisite](#prerequisite)
    - [Start the example](#start-the-example)

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

To generate a smart-contract from the above design. We need to construct an [Aloxide configuration](./aloxide.yml):

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
since they have two options: October 2nd or December 30th. These decisions must be made before September 29th. With these inputs, we have data represents in JSON format as bellow (more detail [here](./docs/poll-data.json)):

```json
[
  {
    "pollId": 1001,
    "name": "Lets have happy time together.",
    "body": "We have three options. Where should we go?",
    "start": "September 21st",
    "end": "September 29th",
    "options": [
      {
        "optionId": 10001,
        "name": "Vietname"
      },
      {
        "optionId": 10002,
        "name": "Thailand"
      },
      {
        "optionId": 10003,
        "name": "Singapore"
      }
    ]
  },
  {
    "pollId": 2001,
    "name": "Lets have a happy time together.",
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

- [push data to blockchain](./docs/make-sample-data.md)

Since smart-contract on the blockchain is also called a decentralized application (DApp), data can be a push from anywhere: command-line tools, webs, third-party applications, mobile applications... Our Aloxide will help set up a simple way to sync those data from the blockchain to centralized databases so that, we can do some complicated queries.

- How many members have participated in the poll?
- Which option is likely a potential one?

## Usage

### Prerequisite

This project is set up of `@aloxide/demux` that syncs data from the blockchain to 4 databases at the same time.
To run this project on your machine, you will need:

- docker: https://www.docker.com/products/docker-desktop
- docker-compose: https://docs.docker.com/compose/install/. Note that is tool might be installed along with the above tool. You can check whether it is available by this command:

```bash
docker-compose -v
# docker-compose version 1.27.2, build 18f557f9
```

- Node js: https://nodejs.org/en/. And please install yarn after install node js: `npm i -g yarn`.

### Start the example

Here are steps to start the project.

1. Start local databases using docker-compose: `docker-compose up -d`
2. Install dependency: `yarn install`
3. Start syncing blockchain: `yarn dev`
