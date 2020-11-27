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

Use `testtransact` [contract](https://github.com/danielAlvess/eos-send-inline-and-deferred-transaction) to test inline and deferred action


```bash
## push action create POLL as inline action

# delegate creator permission to testtransact account
cleost set account permission daniel111111 active '{"threshold": 1,"keys": [{"key": "EOS6yfoREUrCWa1MZkjnfhLyG2cBk9spkayth6NKPBCmpLkzEK7NG","weight": 1}],"accounts": [{"permission":{"actor":"testtransact","permission":"eosio.code"},"weight":1}]}' owner -p daniel111111


# pack action data to create POLL
cleost convert pack_action_data helloworld12 crepoll '["daniel111111", 64, "poll test", "test test test"]'
1042082144e5a649400000000000000009706f6c6c20746573740e7465737420746573742074657374

# send inline action to create POLL
cleos -u https://testnet.canfoundation.io push action testtransact sendinline '["daniel111111", "helloworld12", "crepoll", "1042082144e5a649400000000000000009706f6c6c20746573740e7465737420746573742074657374"]' -p daniel111111

# send deferred action to create POLL
cleos -u https://testnet.canfoundation.io convert pack_action_data helloworld12 crepoll '["daniel111111", 65, "poll test", "test test test"]'
1042082144e5a649410000000000000009706f6c6c20746573740e7465737420746573742074657374

cleos -u https://testnet.canfoundation.io push action testtransact senddeferred '["daniel111111", "helloworld12", "crepoll", "1042082144e5a649410000000000000009706f6c6c20746573740e7465737420746573742074657374"]' -p daniel111111
```



### Enable watcher on ICON loop

Create `.env` file as below

```text
app_enable_eos=false
app_enable_icon=true
```

## Start demo

We can start demo if with default setting.

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
