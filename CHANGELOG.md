# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/lecle/aloxide/compare/v0.5.0...v0.6.0) (2020-12-16)

### Features

- **demux:** :sparkles: support get blockchain data from hyperion api ([1b38168](https://github.com/lecle/aloxide/commit/1b38168af1a214d6141ce0777a3ef4d6386d187f))

# [0.5.0](https://github.com/lecle/aloxide/compare/v0.4.0...v0.5.0) (2020-11-10)

### Bug Fixes

- **demux:** :bug: handler version type as index need to have fix length ([556318f](https://github.com/lecle/aloxide/commit/556318f355b33a425aa3d64019c9b7a7b6b57697))

### Features

- **bridge:** :sparkles: add metadata to field ([a9621e7](https://github.com/lecle/aloxide/commit/a9621e7bb2760c2f1453a69adefc8c67b4080d30))
- **model-sequelize:** :sparkles: apply advanced config with meta data in field config ([75e2f7f](https://github.com/lecle/aloxide/commit/75e2f7f2d3904af7559274d7190754d4907e0dfe))

# [0.4.0](https://github.com/lecle/aloxide/compare/v0.3.0...v0.4.0) (2020-11-06)

### Bug Fixes

- **abstraction:** :bug: remove redundant parameter ([b8b778a](https://github.com/lecle/aloxide/commit/b8b778a7c7325d11a7eeb419674626fe8d8c2edf))
- **aloxide-js:** fix issue that cannot deploy/update smart contract via SDK ([#103](https://github.com/lecle/aloxide/issues/103)) ([3e00dcf](https://github.com/lecle/aloxide/commit/3e00dcf649de623e79e90baaf8887fa335c774eb))
- **bridge:** :wheelchair: if outputPath is not absolute path then it should be a relative to the global config ([fcfd324](https://github.com/lecle/aloxide/commit/fcfd324bf5e9019429bb0ce41c077917453de43f))
- **bridge:** fix issue that deployed smart contract doesn't show any GET methods ([#103](https://github.com/lecle/aloxide/issues/103)) ([1e1d40a](https://github.com/lecle/aloxide/commit/1e1d40a8bc7f739c8c04ac176e42ef34eff283c0))
- **chore:** ignore ts ([f368768](https://github.com/lecle/aloxide/commit/f36876892fb98a5f9dd7c1e4ceb5e0882d01af70))

### Features

- **abstraction:** :sparkles: separate the eos and can builder ([afeddc2](https://github.com/lecle/aloxide/commit/afeddc20b9050e0e44071c129e3a11517747c7c8))
- **chore:** enhance unit test ([#109](https://github.com/lecle/aloxide/issues/109)) ([c14e84c](https://github.com/lecle/aloxide/commit/c14e84cbbf005e00bdfaa2873e461d15bfe3f8fa))

# [0.3.0](https://github.com/lecle/aloxide/compare/v0.2.1...v0.3.0) (2020-10-28)

### Bug Fixes

- **aloxide-js:** fix ICON SDK type definitions ([#50](https://github.com/lecle/aloxide/issues/50)) ([a323464](https://github.com/lecle/aloxide/commit/a3234646fbfdfa61b86bc75e8f05413699e10307))
- **aloxide-js:** fix linter and beatify files ([#50](https://github.com/lecle/aloxide/issues/50)) ([7a44c1c](https://github.com/lecle/aloxide/commit/7a44c1cd0e77bba80875e7c4a4f2f0257e49b951))
- **bridge:** :bug: generate EOS smart-contract with logDataOnly ([700bd93](https://github.com/lecle/aloxide/commit/700bd93a5c06e0835d44a9eccdfe3585fbe93ef9))
- **chore:** change version of supported eosjs and icon sdk to newest and update yarn.lock ([#50](https://github.com/lecle/aloxide/issues/50)) ([7a71aea](https://github.com/lecle/aloxide/commit/7a71aead63f9ab2c1c754a2c6688a25ae6ce9f75))
- **demux:** :bug: typo in file name ([7485a04](https://github.com/lecle/aloxide/commit/7485a044e7eb9316bcf42c88567ddc26f41aa0f7))
- **example-api-gateway:** :bug: update configuration of model builder ([280b349](https://github.com/lecle/aloxide/commit/280b3493ea2bdb009688655ab54cd5c9d27714a7))
- **example-demux:** :bug: fix mismatch version ([bd2adca](https://github.com/lecle/aloxide/commit/bd2adcac69d6b37ab87cdcbdc201421a4993d9d5))
- **example-demux:** :bug: force recreate table ([fa0aa61](https://github.com/lecle/aloxide/commit/fa0aa6154e4cdff2ce290429a361ad54568d8fc2))
- **example-generante-sm:** :bug: remove model of sequelize ([91bc96f](https://github.com/lecle/aloxide/commit/91bc96fa92ffc6dffe20a6ebbf7cd077e4897c12))
- **model-knex:** :bug: fix mismatch version ([daef6c4](https://github.com/lecle/aloxide/commit/daef6c43a5ba0eac7273c6d76e6c71c50b88a4c5))
- **model-sequelize:** :bug: fix map string type to text ([4ab0a1d](https://github.com/lecle/aloxide/commit/4ab0a1def5cac91f31129c1cd1b1167bbd37a0d8))
- **model-sequelize:** :bug: private key with string can not have size greater than 3072 bytes ([22b96f1](https://github.com/lecle/aloxide/commit/22b96f1ccbf41406b8193b5ba7d25ade133005c4))
- **setup:** :fire: remove ambiguous field version in the setup package.json file ([d1ce8be](https://github.com/lecle/aloxide/commit/d1ce8be99c20fe5be0a68d1f19f3869ad9c69298))

### Features

- **abstraction:** :sparkles: add command-line tool for generateing smart contract ([c523a72](https://github.com/lecle/aloxide/commit/c523a72a20172767777fe0da7153c26b06644e90))
- **aloxide-js:** add Aloxide network config validation ([#50](https://github.com/lecle/aloxide/issues/50)) ([73ad30d](https://github.com/lecle/aloxide/commit/73ad30d3a10921b793ea5db466f4a8d8b5aa11d2))
- **aloxide-js:** add Entity Manager to the SDK to make it easier to read/write data on blockchain ([#19](https://github.com/lecle/aloxide/issues/19)) ([04fefb9](https://github.com/lecle/aloxide/commit/04fefb9c5e6798283d986e398fdc037ce9da7841))
- **aloxide-js:** add type definitions to aloxide JS ([#50](https://github.com/lecle/aloxide/issues/50)) ([3a5bf56](https://github.com/lecle/aloxide/commit/3a5bf56930312e77233c686c8b137a64475a8899))
- **aloxide-js:** add unit test ([#19](https://github.com/lecle/aloxide/issues/19)) ([150ab56](https://github.com/lecle/aloxide/commit/150ab56c2a4c9c638c1f4b7778753d7aa6db5934))
- **aloxide-js:** enhance SDK read/write function and clean code ([#19](https://github.com/lecle/aloxide/issues/19)) ([73fcdbe](https://github.com/lecle/aloxide/commit/73fcdbe5f109b7ee290b8be752dc91f2be4665ae))
- **aloxide-js:** support configuring path for blockchain network ([#19](https://github.com/lecle/aloxide/issues/19)) ([bcc0e5e](https://github.com/lecle/aloxide/commit/bcc0e5e605e9e0a4d9d2231fe64c442893b5b73d))
- **aloxide-js:** update test case ([#50](https://github.com/lecle/aloxide/issues/50)) ([b825ca0](https://github.com/lecle/aloxide/commit/b825ca0d8e73e79b3a8b4c03c5b02388d1d4bc08))
- **aloxide-js:** update test case for helpers and EOS ([#50](https://github.com/lecle/aloxide/issues/50)) ([a04cde0](https://github.com/lecle/aloxide/commit/a04cde03f492df38b1cd1a764d74cca73f0db3f7))
- **alxdjs:** sdk to deploy smart contract ([c7fda29](https://github.com/lecle/aloxide/commit/c7fda2946f2291163e299c0a95c5cf9af4b61e81))
- **demux-icon:** add unit test for util ([832717b](https://github.com/lecle/aloxide/commit/832717bad03cce892e8d5c516cd18b7608cbafed))
- **example-aloxide-js:** add example repo to show how to use Aloxidde JS SDK ([#19](https://github.com/lecle/aloxide/issues/19)) ([b482258](https://github.com/lecle/aloxide/commit/b4822585ac5e645ff471bedbae0ac6d71b5cbd1c))
- **example-demux:** :pencil: push sample data to blockchain ([48a1199](https://github.com/lecle/aloxide/commit/48a1199d2bd673eb89efaab367191738a58a8c77))
- **example-demux:** :sparkles: [#82](https://github.com/lecle/aloxide/issues/82) add example demux ([8a68e94](https://github.com/lecle/aloxide/commit/8a68e9487ca9a3603c0add83ef12b4cba1973968))
- **example-demux:** :sparkles: deploy smart-contract to CAN ([d439e9c](https://github.com/lecle/aloxide/commit/d439e9c230322905485887dd88cf3e676dfbac01))
- **example-demux:** :sparkles: index data to dynamodb ([f1ed0b8](https://github.com/lecle/aloxide/commit/f1ed0b825051d8f840a9bb1547c78cb23dc9fe84))
- **example-demux:** :sparkles: index data to mongo DB ([2e816cd](https://github.com/lecle/aloxide/commit/2e816cdb7335eaa8277f481b4984f5b190636f15))
- **example-demux:** :sparkles: index data to postgres and mysql ([f6fb35f](https://github.com/lecle/aloxide/commit/f6fb35fc74180acf2d5ffa57861cfe9f73ad3199))
- **model-knex:** :package: add new module @aloxide/model-knex ([b6efb0e](https://github.com/lecle/aloxide/commit/b6efb0e1618efa1764d38fdc9613a7bc9a9339a1))
- **model-sequelize:** enhance unit test ([bd1255a](https://github.com/lecle/aloxide/commit/bd1255a1d41976790f88480d05ff8596e043e41a))

## [0.2.1](https://github.com/lecle/aloxide/compare/v0.2.0...v0.2.1) (2020-09-29)

### Bug Fixes

- **abstraction:** :fire: remove `validate` since we don't need it ([fe0ca77](https://github.com/lecle/aloxide/commit/fe0ca77880c312f7cc080441bf50e19f1c6aa05f))
- **bridge:** add clean mock ([d23e7c6](https://github.com/lecle/aloxide/commit/d23e7c64bd8d96e0ce96ae896c3db8bdb3d0fccc))
- **demux:** :white_check_mark: fix unit test of DbUpdater.ts ([c37b003](https://github.com/lecle/aloxide/commit/c37b003c0b130b8a33d7e2d9cfddf92330b82df3))
- **setup:** :bug: fix publish script ([9cba1f9](https://github.com/lecle/aloxide/commit/9cba1f94c6b79662037c7faaadd08bdb22799a92))

### Features

- **demux:** :sparkles: [#89](https://github.com/lecle/aloxide/issues/89) add the payload to metadata so that we can get ([b6b399f](https://github.com/lecle/aloxide/commit/b6b399ffb35eebb5ed6b0d3ad2618f2427003cf8))
- **demux:** :sparkles: export BaseHandlerVersion ([e0c52c0](https://github.com/lecle/aloxide/commit/e0c52c04bbb909ab1c7fe72c3e91137d9b46cebe))

# 0.2.0 (2020-09-25)

### Bug Fixes

- **abstraction:** :art: fix variable naming ([a37fdf3](https://github.com/lecle/aloxide/commit/a37fdf3479293727aa196c1d5f832a0d728f6182))
- **abstraction:** :bug: fix case of letter in `utils` ([792062b](https://github.com/lecle/aloxide/commit/792062b24a5315fead0034846f5c00a9f119c595))
- **abstraction:** :fire: fix removing @aloxide/logger ([f609e74](https://github.com/lecle/aloxide/commit/f609e74635d4f3748bc7d8d036636845b6d2f7dd))
- **app:** :arrow_up: update dependency lock ([55fea62](https://github.com/lecle/aloxide/commit/55fea626bb3d1c0532bc7f507c0cb1b39a4b0a91))
- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **app:** :lipstick: remove redundant log debug of config.adapter ([7ba20b9](https://github.com/lecle/aloxide/commit/7ba20b9b7daddf762312896c7ea51f8af040174a))
- **app:** read smart contract template from node_modules ([ab6a866](https://github.com/lecle/aloxide/commit/ab6a86692976103034b4eaf96c9cd3de703f3828))
- **app:** update resolve template path ([01cf607](https://github.com/lecle/aloxide/commit/01cf6071546478274925a701e19ff6ede600b3a2))
- **birdge:** use lower;5D case for method in ICON ([6c1cc7b](https://github.com/lecle/aloxide/commit/6c1cc7bbf6f42e22f2519fcd3cc55c1d73c9a20f))
- **bridge:** :art: shorten log output ([da7da06](https://github.com/lecle/aloxide/commit/da7da0632c92fb37f5db7582d8ff08f603ebc6e7))
- **bridge:** :bug: correct the naming cre udp del ([943bfef](https://github.com/lecle/aloxide/commit/943bfef36a14fd3782b0d86452d92c18e49afb27))
- **bridge:** :fire: remove unused file ([8da1d3f](https://github.com/lecle/aloxide/commit/8da1d3f79fb344163688f720d5d40f072974bcc3))
- **bridge:** remove unused ([0a3b83b](https://github.com/lecle/aloxide/commit/0a3b83b5a2d93f04662398dacf0f5c8179785e02))
- **chore:** change/update license to valid string ([120e0ed](https://github.com/lecle/aloxide/commit/120e0edad9077ece50aedbe18789392aefb3e6ef))
- **demux:** :beers: export DataAdapter ([fac0c74](https://github.com/lecle/aloxide/commit/fac0c7419ca0046a9052741ffd93784f75c7e6d5))
- **demux:** :bug: fix field type of index state ([3f98035](https://github.com/lecle/aloxide/commit/3f98035f84c4567262758c1c2259d3fd69497a54))
- **demux:** :bug: fix mapping type ([ab2ced7](https://github.com/lecle/aloxide/commit/ab2ced78c1581a1599576ea94b23745fb3bf10be))
- **demux:** :bug: initialize started block with the lastest processed block ([0d24040](https://github.com/lecle/aloxide/commit/0d24040f6717a3c649d962277d96535797c470c7))
- **demux:** :bug: update demux to version 5.0.2-581 ([68ccea7](https://github.com/lecle/aloxide/commit/68ccea7523570df1cb43c32ef00483c5ebbc05a5))
- **demux:** :poop: fix storing index state ([8470271](https://github.com/lecle/aloxide/commit/8470271a72adbf38f22f43ea980b53d57115f080))
- **demux:** :sparkles: upgrade demux version to 5.0.2-581 ([0edd068](https://github.com/lecle/aloxide/commit/0edd068172c338bce6a568cff8ca3e7391127cf7))
- **demux:** :zap: remove redundant code in AloxideActionHandler ([2a53a7c](https://github.com/lecle/aloxide/commit/2a53a7c0493c0f4c39621713ad92f8a9ce0b1d66))
- **demux:** :zap: try improve build speed ([76952b3](https://github.com/lecle/aloxide/commit/76952b3688c2d6f0204ad7a180d4b7a5ae8f6de9))
- **demux-icon:** :bug: fix dependency of bunyan ([8b526d0](https://github.com/lecle/aloxide/commit/8b526d050b282fc29d24bebaa273e648b91a4dc4))
- **demux-icon:** :bug: fix the config of retry request ([cc8bf9c](https://github.com/lecle/aloxide/commit/cc8bf9cdf1cbb9bf8bddd183b3a994184cd524c2))
- **demux-icon:** :bug: get block by height require hex code to be lower case ([6728af0](https://github.com/lecle/aloxide/commit/6728af0e695fd38c207d5dd499b7e449b806f270))
- **demux-icon:** :bug: unexpected null when destruct data from transaction ([38629c1](https://github.com/lecle/aloxide/commit/38629c19298ea5dc5d458dc47efdde9071466e47))
- **demux-icon:** :bug: update demux icon action payload ([73fc343](https://github.com/lecle/aloxide/commit/73fc34381e3ca8c093b96c3cf478350f66cde053))
- **demux-icon:** :fire: update example minimize logger ([b1f8743](https://github.com/lecle/aloxide/commit/b1f87432bb45ca266ef7621ab7688aa0ad012508))
- **demux-icon:** :pencil: fix version and license ([6d737a6](https://github.com/lecle/aloxide/commit/6d737a6337e1bde6dd645b11165f02c114c865ae))
- **demux-icon:** :white_check_mark: fix unit test ([4566b4f](https://github.com/lecle/aloxide/commit/4566b4fe99e7f69722dfd30b4c75ec3a40de943b))
- **demux-icon:** :white_check_mark: remove unnecessary dependency package ([fc20cc6](https://github.com/lecle/aloxide/commit/fc20cc618c8f3d82793757a79823e23219e665db))
- **example-api-gateway:** :ambulance: update config so that it can work with new @aloxide/demux ([0df8965](https://github.com/lecle/aloxide/commit/0df8965bc4fdec331963ef308e8cfe354400c59c))
- **example-api-gateway:** :ambulance: update configuration since @aloxide/api-gateway changed a lot ([741ce82](https://github.com/lecle/aloxide/commit/741ce82801d556ebda980c5c2911b97203e216a9))
- **example-api-gateway:** :ambulance: update due to demux was changed a lot ([15249d7](https://github.com/lecle/aloxide/commit/15249d70645958c1d1fd472382acb63c888237db))
- **example-api-gateway:** :ambulance: update due to demux was changed a lot ([9a2e2a4](https://github.com/lecle/aloxide/commit/9a2e2a4c4f5d12826613f57947784fb5b6bd6148))
- **example-api-gateway:** :bug: fix script start server ([a117720](https://github.com/lecle/aloxide/commit/a1177209440f289a821f8bd2ff02e22cf97b07ed))
- **example-api-gateway:** :bug: load data from env file ([8fe83a1](https://github.com/lecle/aloxide/commit/8fe83a1ebcf83fb0d81cc38dbc01311a2dfbdd01)), closes [/github.com/lecle/aloxide/pull/16#discussion_r471207441](https://github.com//github.com/lecle/aloxide/pull/16/issues/discussion_r471207441)
- **example-api-gateway:** :bug: remove unused code ([a463245](https://github.com/lecle/aloxide/commit/a463245ad36387313066cda88016ed0a5e95cb54)), closes [/github.com/lecle/aloxide/pull/16#discussion_r471211080](https://github.com//github.com/lecle/aloxide/pull/16/issues/discussion_r471211080)
- **example-api-gateway:** :bulb: fix start script so it does not block global start ([bf6b2e9](https://github.com/lecle/aloxide/commit/bf6b2e946b42e026996d6e8523f9f616195b05ed))
- **example-api-gateway:** :lipstick: remove unused scripts and update doc ([609af3e](https://github.com/lecle/aloxide/commit/609af3eeed8a31eda48b8d58f0487358baa3b6cc))
- **example-api-gateway:** :white_check_mark: fix unit test ([1466eb8](https://github.com/lecle/aloxide/commit/1466eb80460e87421dcab3385c8c46900da5fff9))
- **example-generante-sm:** :wastebasket: change logger and runner ([188faef](https://github.com/lecle/aloxide/commit/188faef65b0187acafd072fe2d1487e3a1120521))
- **logger:** :fire: remove success function in the Logger interface ([4765a3a](https://github.com/lecle/aloxide/commit/4765a3a1e11df495007a7bc5cd045cb78a116b18))
- **logger:** :white_check_mark: fix unit test ([c926af1](https://github.com/lecle/aloxide/commit/c926af1eb2601e389237c21d77a3e756bbd4ad07))
- **model-sequelize:** :art: fix return type ([e42569f](https://github.com/lecle/aloxide/commit/e42569f012474ca207e810f3fd3151d2dabb5ba4))
- **model-sequelize:** :bug: fix import sequelize ([ff419a5](https://github.com/lecle/aloxide/commit/ff419a573805ba2e9e4ce2ad97f5fa1db5d92c6e))
- **model-sequelize:** :bug: type mapping ([e3235b6](https://github.com/lecle/aloxide/commit/e3235b6527540397f4ae0eebf0e83b2e9ba626a8))
- **model-sequelize:** :bug: unknow type NUMBER in postgres ([1e1a549](https://github.com/lecle/aloxide/commit/1e1a5497c1cfb14345dbe0c3170a5631d180b4d7))
- **setup:** :ambulance: remove postinstall hook due to recursively calling yarn install ([111a5cc](https://github.com/lecle/aloxide/commit/111a5cc854242aac1ca47e91e101bae1da5c7d26))
- **setup:** :bug: add ignore env of python env ([162d7ab](https://github.com/lecle/aloxide/commit/162d7abdcb1872a5879d9bef6b88046255823aba))
- **setup:** :bug: fix export logger ([b981904](https://github.com/lecle/aloxide/commit/b9819048ed88f0b2fe1bbce345f7496f4c040c05))
- **setup:** :fire: update public access ([69965d5](https://github.com/lecle/aloxide/commit/69965d52a71494cd1de28bf1a717886f988767a4))
- **setup:** :white_check_mark: we only need to run yarn pub since it call yarn version behind the scenes ([ac58c53](https://github.com/lecle/aloxide/commit/ac58c53f227ae7c3d895773f4f9f77303c6b3824))
- **setup:** :wrench: update configuring of running test unit ([7d92c88](https://github.com/lecle/aloxide/commit/7d92c888b70ccf38816fb762d32145e88a5cb6fb))
- **setup:** config lerna to use single version mode ([62a3882](https://github.com/lecle/aloxide/commit/62a38822ac92aecf0736684033ceec3e65219489))

### Features

- **abstraction:** :sparkles: add option logDataOnly ([fcd80fa](https://github.com/lecle/aloxide/commit/fcd80fa0f2a033cc7dbf29d6033aab3337ad7e06))
- **abstraction:** add more test case and code coverage ([243c344](https://github.com/lecle/aloxide/commit/243c344f0d7c5fee9a4a70c3487930d98f9f0609))
- **api-gateway:** :package: add api-gateway and example ([9fc7729](https://github.com/lecle/aloxide/commit/9fc7729738a76cae992da06c5240f56756ffdd9d))
- **app:** :pencil: add icon template ([275e676](https://github.com/lecle/aloxide/commit/275e676de44c7997281cfbb49c8413463c8b7227))
- **app:** :robot: add supported actions ([c1c7688](https://github.com/lecle/aloxide/commit/c1c76882f16f5662214daa0000bd05c737378ff0))
- **app:** :robot: add supported actions ([178d977](https://github.com/lecle/aloxide/commit/178d977e586b5fb520f009e406f239f6404732c9))
- **app:** :sparkles: remove samples and add bridge + abstraction ([848a10d](https://github.com/lecle/aloxide/commit/848a10db28f04a7e541246eccf0fe2a6861cdc45))
- **app:** :zap: add dummy data for testing server ([4a37ed3](https://github.com/lecle/aloxide/commit/4a37ed3b23b954ddffd6e45c17cc908533979fa6))
- **app:** :zap: add MultipleContractAdapter ([6f854df](https://github.com/lecle/aloxide/commit/6f854df45e9018b1353c39e014f31411868d0e81))
- **app:** add generating tables ([60eb149](https://github.com/lecle/aloxide/commit/60eb149368d6bbad939abb93b2713afb3d94568d))
- **bastraction:** validate entities ([d597466](https://github.com/lecle/aloxide/commit/d597466ba0ee43fcc108566a3a82e8015e9e4f79))
- **bridge:** :sparkles: add option logDataOnly ([9261d26](https://github.com/lecle/aloxide/commit/9261d2637e19ac8ae8e96f77343e747546c79e15))
- **bridge:** :sparkles: add option outputPath ([bf14c51](https://github.com/lecle/aloxide/commit/bf14c516e4785f73c5b4732fe10f64f88715e511))
- **bridge:** :sparkles: add sequelize model adapter ([e8c4a06](https://github.com/lecle/aloxide/commit/e8c4a069e6c095c76be46ff5c9af37710bdf4ffd))
- **bridge:** :sparkles: create table method template for ICON ([#30](https://github.com/lecle/aloxide/issues/30)) ([7ac784a](https://github.com/lecle/aloxide/commit/7ac784ad443d6574b72b18a6e7c43374800a31fe))
- **bridge:** add test for eoc contract ([32756cb](https://github.com/lecle/aloxide/commit/32756cb6e218fdce41894b213e8e942c5cc39ad1))
- **bridge:** add test for icon contract ([c61866f](https://github.com/lecle/aloxide/commit/c61866f31c7fd19729abba3128918068a0c87855))
- **bridge:** add test for model adapter ([49d33e4](https://github.com/lecle/aloxide/commit/49d33e4160f0a3d87d51fc52715877128de32b86))
- **bridge:** revert change jest config ([a3bcc8b](https://github.com/lecle/aloxide/commit/a3bcc8bad6a78e484036deeb21586fc1f2503790))
- **bridge:** update jest config ([584b7da](https://github.com/lecle/aloxide/commit/584b7da36915efb66103076a3955799312544dd2))
- **chore:** add contributing docs ([51314af](https://github.com/lecle/aloxide/commit/51314af0db9b0807770baaeff281037c78c0fe23))
- **demux:** :ambulance: export createDbUpdater for better supporting customization ([1741e06](https://github.com/lecle/aloxide/commit/1741e064debbcff9e85cdef41edf93cf751bfc9f))
- **demux:** :fire: remove dependency on sequelize ([3ee036c](https://github.com/lecle/aloxide/commit/3ee036c2b1287de2baf30fd524e7ca3d0112ec83))
- **demux:** :poop: change option and params of AloxideActionHandler ([683ccad](https://github.com/lecle/aloxide/commit/683ccad7f14888e783c28503910478a265cc95ae))
- **demux:** :sparkles: add blockchain name to option ([695c84c](https://github.com/lecle/aloxide/commit/695c84c8c38b649d36c6d5971d3bcbe2e659e797))
- **demux:** :sparkles: introduce AloxideDataManager ([ff9de21](https://github.com/lecle/aloxide/commit/ff9de212bdea77ff6a77f48de888dfdcd7c8e6f4))
- **demux:** :sparkles: update DataAdapter support query count and findAll ([44fc411](https://github.com/lecle/aloxide/commit/44fc41122b7c2dde88431366056a85ede54d2095))
- **demux:** :zap: change option handlerVersions to array ([5a390b6](https://github.com/lecle/aloxide/commit/5a390b62ad475787bd36da28346cd8a722d682ac))
- **demux-icon:** :fire: add demux icon ([5780e87](https://github.com/lecle/aloxide/commit/5780e877b048e434faa87eb324536610c9852e49))
- **demux-icon:** :sparkles: add auto parse hex to number in icon data params ([cfbf208](https://github.com/lecle/aloxide/commit/cfbf2085a8142aaf72ed9eeaba393606d41b5a97))
- **example-api-gateway:** :sparkles: add watcher on iconloop ([9de0ae6](https://github.com/lecle/aloxide/commit/9de0ae6bd5f8c568e7d21efd3d4606f0e588a81d))
- **example-api-gateway:** :sparkles: apply change from model-squelize ([0cb164a](https://github.com/lecle/aloxide/commit/0cb164a3bd7c5f5e3342021dc4a1e57065c353bd))
- **example-generante-sm:** :ambulance: add example of generate smart-contract no-state-data ([bda84fa](https://github.com/lecle/aloxide/commit/bda84fa3a9abbfcf994f58a72ca2d6b50e5ffd5d))
- add AloxideActionWatcher to watch blockchain once (read one block and exit) ([#47](https://github.com/lecle/aloxide/issues/47)) ([8037b36](https://github.com/lecle/aloxide/commit/8037b365f6de16396de1e82cc1003ff5baf0ebed))
- **example-generante-sm:** :sparkles: add local testing for icon smart contract ([f28bbc6](https://github.com/lecle/aloxide/commit/f28bbc67c0ca7258e28b7778fccdd01130d6c04f))
- **example-generante-sm:** :sparkles: add t-bears command using docker ([57f2fef](https://github.com/lecle/aloxide/commit/57f2fef3961e304a1b5f28d5833d7d48004dce7f))
- **setup:** :egg: setup lerna ([9a9f7bf](https://github.com/lecle/aloxide/commit/9a9f7bf450a953454d02e464536336db7a2bf6c4))
- **setup:** :sparkles: update lerna config version and publish ([636d0f5](https://github.com/lecle/aloxide/commit/636d0f53a109303b0badb07772646a0cba14b41a))
- **setup:** :zap: add tslint configuration ([465fa30](https://github.com/lecle/aloxide/commit/465fa30b5c1799265dbddc1b5d970c04e4f3e9f4))

- refactor(example-generante-sm)!: :art: change variable name from `resultPath` to `outputPath` ([15e97a4](https://github.com/lecle/aloxide/commit/15e97a47595b4033e41bf7c4d3a40241352e725b))
- refactor(demux)!: :rotating_light: remove dependency on demux-eos ([d826b54](https://github.com/lecle/aloxide/commit/d826b545b05f397f8dacfae46cc5be469ca532ab))

### BREAKING CHANGES

- - update ContractGeneratorConfig
- - option `actionReader` become require
- remove option `nodeActionReaderOptions`
