# `example-api-gateway`

```
environment

https://devnet.canfoundation.io
Https://history.devnet.canfoundation.io

http://state.devnet.canfoundation.io:8080/
WebSocket Connection = Port 8080
```

## Deploy smart contract

```bash
cd ./contracts

# buid smart contract
eosio-cpp hello.cpp -o hello.cpp

alias cleost="cleos -u https://devnet.canfoundation.io"
# create account
cleost system newaccount\
  canlab helloworld12 EOS7RzpySpvSH4BZ2jb5yZpEuueVwCb7sFF3MwHydbNKYEyv6Zhqf EOS7RzpySpvSH4BZ2jb5yZpEuueVwCb7sFF3MwHydbNKYEyv6Zhqf\
  --stake-net '10.0000 CAT'\
  --stake-cpu '10.0000 CAT'\
  --buy-ram-kbytes 1024\
  -p canlab@active

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

```bash
# start watching blockchain
yarn start:demux

# push action create POLL

cleost push action helloworld12 crepoll '["helloworld12", 1005, "test-create-poll", "body of poll"]' -p helloworld12
cleost push action helloworld12 updpoll '["helloworld12", 1005, "test-create-poll", "body of poll"]' -p helloworld12
cleost push action helloworld12 delpoll '["helloworld12", 1005]' -p helloworld12

```
