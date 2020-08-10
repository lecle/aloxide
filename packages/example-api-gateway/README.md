# `example-api-gateway`

```
environment

https://testnet.canfoundation.io
```

## Deploy smart contract

```bash
cd ./contracts

# buid smart contract
eosio-cpp hello.cpp -o hello.wasm

alias cleost="cleos -u https://testnet.canfoundation.io"
# create account
cleost system newaccount\
  can helloworld12 EOS7RzpySpvSH4BZ2jb5yZpEuueVwCb7sFF3MwHydbNKYEyv6Zhqf EOS7RzpySpvSH4BZ2jb5yZpEuueVwCb7sFF3MwHydbNKYEyv6Zhqf\
  --stake-net '10.0000 CAT'\
  --stake-cpu '10.0000 CAT'\
  --buy-ram-kbytes 1024\
  -p can@active

cleos wallet import --private-key 5JXAphkEA3goZrkEoJsA1PyNRF8tHbZq5b9DMPhpBSf2LpvMSzT

# deploy smart contract
cleost set contract helloworld12 . hello.wasm hello.abi -p helloworld12@active

# test
cleost push action helloworld12 hi '["helloworld12"]' -p helloworld12
# executed transaction: f03eb4b9936e2096c5cdbee10502b5c8e5e566656902ea38ee8b8593799610d0  104 bytes  217 us
# #  helloworld12 <= helloworld12::hi             {"user":"helloworld12"}
# >> hello, helloworld12
# warning: transaction executed locally, but may not be confirmed by the network yet
```

## Usage

**Note**: remember to create `.env` file

```bash
# start watching blockchain
yarn start:demux

# push action create POLL

cleost push action helloworld12 crepoll '["helloworld12", 1005, "test-create-poll", "body of poll"]' -p helloworld12
cleost push action helloworld12 updpoll '["helloworld12", 1005, "test-update-poll", "new body of poll"]' -p helloworld12
cleost push action helloworld12 delpoll '["helloworld12", 1005]' -p helloworld12

cleost push action helloworld12 crevote '["helloworld12", 1005, 1, 2, 3]' -p helloworld12
cleost push action helloworld12 updvote '["helloworld12", 1005, 10, 200, 5]' -p helloworld12
cleost push action helloworld12 delvote '["helloworld12", 1005]' -p helloworld12

```

## Start demo

We can start demo if with defaul setting.

1. change directory to `.../aloxide`
2. start local posgres database using docker compose: `docker-compose up -d`
3. change directory to `.../aloxide/packages/example-api-gateway`
4. create `.env` file base on missing values in `.env.defaults`
5. start watching blockchain network: `yarn start:demux`
6. start server: `yarn start:server`, output may look like below
7. open `play-ground` link or `api-gateway`

Output of `yarn start:server`:

```log
Server is running on http://localhost:4000
GraphQL is served at: /graphql
ResfullAPI is served at: http://localhost:4000/api-gateway
Playground http://localhost:4000/playground
```
