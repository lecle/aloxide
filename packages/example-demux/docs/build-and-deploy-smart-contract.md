<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Smart-contract](#smart-contract)
  - [Build smart-contract](#build-smart-contract)
  - [Deploy smart-contract](#deploy-smart-contract)
    - [Deploy to EOS](#deploy-to-eos)
    - [Deploy to CAN](#deploy-to-can)
    - [Deploy to ICON](#deploy-to-icon)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Smart-contract

## Build smart-contract

Build smart-contract from configured model [aloxide.yml](../aloxide.yml).

```bash
# generate smart-contract for ICON, EOS, and CAN
# since CAN and EOS uses the same engine, we only need to generate eos
yarn aloxide create ./aloxide.yml -o ./out -a 'eos,icon'

# our smart-contract will be located at ./out
```

## Deploy smart-contract

### Deploy to EOS

| Network   | Note                                   |
| --------- | -------------------------------------- |
| Testnet   | jungle 3 crypto lions                  |
| URL       | https://jungle3.cryptolions.io         |
| Home page | https://monitor.jungletestnet.io/#home |

To create an account we need to go to [jungle-home-page](https://monitor.jungletestnet.io/#home).

| Account name | Note                 | Owner key          | Active key          |
| ------------ | -------------------- | ------------------ | ------------------- |
| aloxidepolla | smart-contract owner | ~~secret~~         | ~~secret~~          |
| aloxideuser1 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser2 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser3 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser4 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser5 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |

Deploy smart-contract from `./out/eos`:

```bash
# change directory to smart-contract place
cd out/eos

# compile to wasm
eosio-cpp hello.cpp

# import wallet
cleos wallet import --private-key ~~secret~~
# imported private key for: EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg

# buy ram
cleos -u https://jungle3.cryptolions.io system buyram aloxidepolla aloxidepolla 2048 -k
# executed transaction: a68c583aacb2bd77191f2349292532d06e6958bceab4024259abfca49c5de286  112 bytes  293 us
#         eosio <= eosio::buyrambytes           {"payer":"aloxidepolla","receiver":"aloxidepolla","bytes":2097152}
#   eosio.token <= eosio.token::transfer        {"from":"aloxidepolla","to":"eosio.ram","quantity":"38.0137 EOS","memo":"buy ram"}
#   eosio.token <= eosio.token::transfer        {"from":"aloxidepolla","to":"eosio.ramfee","quantity":"0.1911 EOS","memo":"ram fee"}
#   eosio.token <= eosio.token::transfer        {"from":"eosio.ramfee","to":"eosio.rex","quantity":"0.1911 EOS","memo":"transfer from eosio.ramfee t...
#  aloxidepolla <= eosio.token::transfer        {"from":"aloxidepolla","to":"eosio.ram","quantity":"38.0137 EOS","memo":"buy ram"}
#     eosio.ram <= eosio.token::transfer        {"from":"aloxidepolla","to":"eosio.ram","quantity":"38.0137 EOS","memo":"buy ram"}
#  aloxidepolla <= eosio.token::transfer        {"from":"aloxidepolla","to":"eosio.ramfee","quantity":"0.1911 EOS","memo":"ram fee"}
#  eosio.ramfee <= eosio.token::transfer        {"from":"aloxidepolla","to":"eosio.ramfee","quantity":"0.1911 EOS","memo":"ram fee"}
#  eosio.ramfee <= eosio.token::transfer        {"from":"eosio.ramfee","to":"eosio.rex","quantity":"0.1911 EOS","memo":"transfer from eosio.ramfee t...
#     eosio.rex <= eosio.token::transfer        {"from":"eosio.ramfee","to":"eosio.rex","quantity":"0.1911 EOS","memo":"transfer from eosio.ramfee t...
# warning: transaction executed locally, but may not be confirmed by the network yet         ]

# Deploy smart contract
# $ pwd
# aloxide/packages/example-demux/out/eos
cleos -u https://jungle3.cryptolions.io set contract aloxidepolla . hello.wasm hello.abi
# Reading WASM from /Users/manh/mworks/aloxide/packages/example-demux/out/eos/hello.wasm...
# Publishing contract...
# executed transaction: 5b181feae665cc11ec456d8b49977e4301618810c2294a2a4d217a56d5438877  6952 bytes  817 us
# #         eosio <= eosio::setcode               {"account":"aloxidepolla","vmtype":0,"vmversion":0,"code":"0061736d0100000001b3011c60000060017f00600...
# #         eosio <= eosio::setabi                {"account":"aloxidepolla","abi":"0e656f73696f3a3a6162692f312e31000d096372656f7074696f6e0004047573657...
# warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

[Url result](https://jungle3.bloks.io/account/aloxidepolla?loadContract=true&tab=Tables&account=aloxidepolla&scope=aloxidepolla&limit=100)
(open tab [**\</\> Contract**])

### Deploy to CAN

| Network   | Note                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- |
| Testnet   | CAN testnet                                                                                        |
| URL       | https://testnet.canfoundation.io                                                                   |
| Home page | https://local.bloks.io/?nodeUrl=history.testnet.canfoundation.io&coreSymbol=CAT&systemDomain=eosio |

| Account name | Note                 | Owner key          | Active key          |
| ------------ | -------------------- | ------------------ | ------------------- |
| aloxidepolla | smart-contract owner | ~~secret~~         | ~~secret~~          |
| aloxideuser1 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser2 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser3 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser4 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |
| aloxideuser5 | a member of a group  | aloxidepolla@owner | aloxidepolla@active |

Deploy smart-contract from `./out/eos`:

```bash
# compilte to wasm
eosio-cpp hello.cpp

# import wallet
cleos wallet import --private-key ~~secret~~
# imported private key for: EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg

# create account
cleos -u https://testnet.canfoundation.io system newaccount canlab aloxidepolla EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg --stake-net "10.0000 CAT" --stake-cpu "10.0000 CAT" --buy-ram-bytes 2048

# faucet
cleost transfer canlab aloxidepolla "100.0000 CAT" "faucet"
# executed transaction: ab65058a40b6d88408530fd737aa4688e817b166d21e06b93628e7829662f266  136 bytes  255 us
#   eosio.token <= eosio.token::transfer        {"from":"canlab","to":"aloxidepolla","quantity":"100.0000 CAT","memo":"faucet"}
#        canlab <= eosio.token::transfer        {"from":"canlab","to":"aloxidepolla","quantity":"100.0000 CAT","memo":"faucet"}
#  aloxidepolla <= eosio.token::transfer        {"from":"canlab","to":"aloxidepolla","quantity":"100.0000 CAT","memo":"faucet"}

cleos -u https://testnet.canfoundation.io system newaccount aloxidepolla aloxideuser1 EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg --stake-net "0.0500 CAT" --stake-cpu "0.0500 CAT" --buy-ram-bytes 300
cleos -u https://testnet.canfoundation.io system newaccount aloxidepolla aloxideuser2 EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg --stake-net "0.0500 CAT" --stake-cpu "0.0500 CAT" --buy-ram-bytes 300
cleos -u https://testnet.canfoundation.io system newaccount aloxidepolla aloxideuser3 EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg --stake-net "0.0500 CAT" --stake-cpu "0.0500 CAT" --buy-ram-bytes 300
cleos -u https://testnet.canfoundation.io system newaccount aloxidepolla aloxideuser4 EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg --stake-net "0.0500 CAT" --stake-cpu "0.0500 CAT" --buy-ram-bytes 300
cleos -u https://testnet.canfoundation.io system newaccount aloxidepolla aloxideuser5 EOS5AbWepMqkzWj9jQpZm4EhiCYwFMzqFqBgs1PtxnTkw4crWadjg --stake-net "0.0500 CAT" --stake-cpu "0.0500 CAT" --buy-ram-bytes 300

# Deploy smart contract
# $ pwd
# aloxide/packages/example-demux/out/eos

# buy ram
cleos -u https://testnet.canfoundation.io system buyram aloxidepolla aloxidepolla 300 -k

# deploy
cleos -u https://testnet.canfoundation.io set contract aloxidepolla . hello.wasm hello.abi
# Reading WASM from /Users/manhvu/mworks/aloxide/packages/example-demux/out/eos/hello.wasm...
# Publishing contract...
# executed transaction: 40851edfda4464d1a1bc515c3ccb5e5706ec2b2c5f9422d8154a407cb7e644b3  6944 bytes  2255 us
# #         eosio <= eosio::setcode               {"account":"aloxidepolla","vmtype":0,"vmversion":0,"code":"0061736d0100000001b3011c60000060017f00600...
# #         eosio <= eosio::setabi                {"account":"aloxidepolla","abi":"0e656f73696f3a3a6162692f312e31000d096372656f7074696f6e0004047573657...
# warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

[Url result](https://local.bloks.io/account/aloxidepolla?nodeUrl=history.testnet.canfoundation.io&coreSymbol=CAT&systemDomain=eosio)
(open tab [**\</\> Contract**])

### Deploy to ICON

| Network                                        | Note                                    |
| ---------------------------------------------- | --------------------------------------- |
| [Testnet](https://www.icondev.io/docs/testnet) | Yeouido - ICON test net for DApps       |
| URL                                            | https://bicon.net.solidwallet.io/api/v3 |
| Home page                                      | https://bicon.tracker.solidwallet.io    |

| Account name | Note                 | Address                                    | Password                                     |
| ------------ | -------------------- | ------------------------------------------ | -------------------------------------------- |
| aloxidepolla | smart-contract owner | hx830879ad5f6cf4bd2df070587a72dc8a9036bf0e | tbears keystore -p ~~secret~~ ./aloxidepolla |
| aloxideuser1 | a member of a group  | hx32c12d0c5a03a19f056af5e6b8240da647921500 | tbears keystore -p ~~secret~~ ./aloxideuser1 |
| aloxideuser2 | a member of a group  | hxc6c9ffc31750916ee74e364c69dcafd543ca651d | tbears keystore -p ~~secret~~ ./aloxideuser2 |
| aloxideuser3 | a member of a group  | hxd06c4869dd66cee6dc8d1781ded38d676e06b84d | tbears keystore -p ~~secret~~ ./aloxideuser3 |
| aloxideuser4 | a member of a group  | hx221dd2a70a59c519f3fe90c63086ea94179de77f | tbears keystore -p ~~secret~~ ./aloxideuser4 |
| aloxideuser5 | a member of a group  | hx92ce88558471325a7eaf3d7ae0e0489b2423d72e | tbears keystore -p ~~secret~~ ./aloxideuser5 |

Deploy smart-contract from `./out/icon`:

```bash
tbears deploy ./out/icon/icon_hello -k ./docs/icon/aloxidepolla -p ~~secret~~
# Send deploy request successfully.
# If you want to check SCORE deployed successfully, execute txresult command
# transaction hash: 0x58f9b6d65d6a2a7333d595a70ec2249b6eb812ed0612743e7afde0502b41e6ec

tbears txresult 0x58f9b6d65d6a2a7333d595a70ec2249b6eb812ed0612743e7afde0502b41e6ec
# Transaction : {
#     "jsonrpc": "2.0",
#     "result": {
#         "txHash": "0x58f9b6d65d6a2a7333d595a70ec2249b6eb812ed0612743e7afde0502b41e6ec",
#         "blockHeight": "0x72f0c7",
#         "blockHash": "0xc3c0880fb1153698ee2c7161ac49e8199a5638e484d6ce9bffb47c195c23944b",
#         "txIndex": "0x1",
#         "to": "cx0000000000000000000000000000000000000000",
#         "scoreAddress": "cxbc1b71bb40ef97c682114e10981169db23138327",
#         "stepUsed": "0x43b23ca0",
#         "stepPrice": "0x2540be400",
#         "cumulativeStepUsed": "0x43b23ca0",
#         "eventLogs": [],
#         "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
#         "status": "0x1"
#     },
#     "id": 1234
# }
```

[Url resutl](https://bicon.tracker.solidwallet.io/transaction/0x58f9b6d65d6a2a7333d595a70ec2249b6eb812ed0612743e7afde0502b41e6ec)
