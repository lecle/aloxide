<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Change Log](#change-log)
- [0.5.0 (2020-11-10)](#050-2020-11-10)
  - [Features](#features)
- [0.4.0 (2020-11-06)](#040-2020-11-06)
  - [Bug Fixes](#bug-fixes)
- [0.3.0 (2020-10-28)](#030-2020-10-28)
  - [Bug Fixes](#bug-fixes-1)
  - [0.2.1 (2020-09-29)](#021-2020-09-29)
    - [Bug Fixes](#bug-fixes-2)
- [0.2.0 (2020-09-25)](#020-2020-09-25)
  - [Bug Fixes](#bug-fixes-3)
  - [Features](#features-1)
- [0.1.0 (2020-09-03)](#010-2020-09-03)
  - [Bug Fixes](#bug-fixes-4)
  - [Features](#features-2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/lecle/aloxide/compare/v0.4.0...v0.5.0) (2020-11-10)

### Features

- **bridge:** :sparkles: add metadata to field ([a9621e7](https://github.com/lecle/aloxide/commit/a9621e7bb2760c2f1453a69adefc8c67b4080d30))

# [0.4.0](https://github.com/lecle/aloxide/compare/v0.3.0...v0.4.0) (2020-11-06)

### Bug Fixes

- **bridge:** :wheelchair: if outputPath is not absolute path then it should be a relative to the global config ([fcfd324](https://github.com/lecle/aloxide/commit/fcfd324bf5e9019429bb0ce41c077917453de43f))
- **bridge:** fix issue that deployed smart contract doesn't show any GET methods ([#103](https://github.com/lecle/aloxide/issues/103)) ([1e1d40a](https://github.com/lecle/aloxide/commit/1e1d40a8bc7f739c8c04ac176e42ef34eff283c0))

# [0.3.0](https://github.com/lecle/aloxide/compare/v0.2.1...v0.3.0) (2020-10-28)

### Bug Fixes

- **bridge:** :bug: generate EOS smart-contract with logDataOnly ([700bd93](https://github.com/lecle/aloxide/commit/700bd93a5c06e0835d44a9eccdfe3585fbe93ef9))

## [0.2.1](https://github.com/lecle/aloxide/compare/v0.2.0...v0.2.1) (2020-09-29)

### Bug Fixes

- **bridge:** add clean mock ([d23e7c6](https://github.com/lecle/aloxide/commit/d23e7c64bd8d96e0ce96ae896c3db8bdb3d0fccc))

# 0.2.0 (2020-09-25)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **app:** read smart contract template from node_modules ([ab6a866](https://github.com/lecle/aloxide/commit/ab6a86692976103034b4eaf96c9cd3de703f3828))
- **app:** update resolve template path ([01cf607](https://github.com/lecle/aloxide/commit/01cf6071546478274925a701e19ff6ede600b3a2))
- **birdge:** use lower;5D case for method in ICON ([6c1cc7b](https://github.com/lecle/aloxide/commit/6c1cc7bbf6f42e22f2519fcd3cc55c1d73c9a20f))
- **bridge:** :art: shorten log output ([da7da06](https://github.com/lecle/aloxide/commit/da7da0632c92fb37f5db7582d8ff08f603ebc6e7))
- **bridge:** :bug: correct the naming cre udp del ([943bfef](https://github.com/lecle/aloxide/commit/943bfef36a14fd3782b0d86452d92c18e49afb27))
- **bridge:** :fire: remove unused file ([8da1d3f](https://github.com/lecle/aloxide/commit/8da1d3f79fb344163688f720d5d40f072974bcc3))
- **bridge:** remove unused ([0a3b83b](https://github.com/lecle/aloxide/commit/0a3b83b5a2d93f04662398dacf0f5c8179785e02))
- **chore:** change/update license to valid string ([120e0ed](https://github.com/lecle/aloxide/commit/120e0edad9077ece50aedbe18789392aefb3e6ef))
- **setup:** :fire: update public access ([69965d5](https://github.com/lecle/aloxide/commit/69965d52a71494cd1de28bf1a717886f988767a4))
- **setup:** :wrench: update configuring of running test unit ([7d92c88](https://github.com/lecle/aloxide/commit/7d92c888b70ccf38816fb762d32145e88a5cb6fb))

### Features

- **app:** :pencil: add icon template ([275e676](https://github.com/lecle/aloxide/commit/275e676de44c7997281cfbb49c8413463c8b7227))
- **app:** :robot: add supported actions ([c1c7688](https://github.com/lecle/aloxide/commit/c1c76882f16f5662214daa0000bd05c737378ff0))
- **app:** :robot: add supported actions ([178d977](https://github.com/lecle/aloxide/commit/178d977e586b5fb520f009e406f239f6404732c9))
- **app:** :sparkles: remove samples and add bridge + abstraction ([848a10d](https://github.com/lecle/aloxide/commit/848a10db28f04a7e541246eccf0fe2a6861cdc45))
- **app:** :zap: add MultipleContractAdapter ([6f854df](https://github.com/lecle/aloxide/commit/6f854df45e9018b1353c39e014f31411868d0e81))
- **app:** add generating tables ([60eb149](https://github.com/lecle/aloxide/commit/60eb149368d6bbad939abb93b2713afb3d94568d))
- **bridge:** :sparkles: add option logDataOnly ([9261d26](https://github.com/lecle/aloxide/commit/9261d2637e19ac8ae8e96f77343e747546c79e15))
- **bridge:** :sparkles: add option outputPath ([bf14c51](https://github.com/lecle/aloxide/commit/bf14c516e4785f73c5b4732fe10f64f88715e511))
- **bridge:** :sparkles: add sequelize model adapter ([e8c4a06](https://github.com/lecle/aloxide/commit/e8c4a069e6c095c76be46ff5c9af37710bdf4ffd))
- **bridge:** :sparkles: create table method template for ICON ([#30](https://github.com/lecle/aloxide/issues/30)) ([7ac784a](https://github.com/lecle/aloxide/commit/7ac784ad443d6574b72b18a6e7c43374800a31fe))
- **bridge:** add test for eoc contract ([32756cb](https://github.com/lecle/aloxide/commit/32756cb6e218fdce41894b213e8e942c5cc39ad1))
- **bridge:** add test for icon contract ([c61866f](https://github.com/lecle/aloxide/commit/c61866f31c7fd19729abba3128918068a0c87855))
- **bridge:** add test for model adapter ([49d33e4](https://github.com/lecle/aloxide/commit/49d33e4160f0a3d87d51fc52715877128de32b86))
- **bridge:** revert change jest config ([a3bcc8b](https://github.com/lecle/aloxide/commit/a3bcc8bad6a78e484036deeb21586fc1f2503790))
- **bridge:** update jest config ([584b7da](https://github.com/lecle/aloxide/commit/584b7da36915efb66103076a3955799312544dd2))

# 0.1.0 (2020-09-03)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **app:** read smart contract template from node_modules ([ab6a866](https://github.com/lecle/aloxide/commit/ab6a86692976103034b4eaf96c9cd3de703f3828))
- **app:** update resolve template path ([01cf607](https://github.com/lecle/aloxide/commit/01cf6071546478274925a701e19ff6ede600b3a2))
- **birdge:** use lower;5D case for method in ICON ([6c1cc7b](https://github.com/lecle/aloxide/commit/6c1cc7bbf6f42e22f2519fcd3cc55c1d73c9a20f))
- **bridge:** remove unused ([0a3b83b](https://github.com/lecle/aloxide/commit/0a3b83b5a2d93f04662398dacf0f5c8179785e02))

### Features

- **app:** :pencil: add icon template ([275e676](https://github.com/lecle/aloxide/commit/275e676de44c7997281cfbb49c8413463c8b7227))
- **app:** :robot: add supported actions ([c1c7688](https://github.com/lecle/aloxide/commit/c1c76882f16f5662214daa0000bd05c737378ff0))
- **app:** :robot: add supported actions ([178d977](https://github.com/lecle/aloxide/commit/178d977e586b5fb520f009e406f239f6404732c9))
- **app:** :sparkles: remove samples and add bridge + abstraction ([848a10d](https://github.com/lecle/aloxide/commit/848a10db28f04a7e541246eccf0fe2a6861cdc45))
- **app:** :zap: add MultipleContractAdapter ([6f854df](https://github.com/lecle/aloxide/commit/6f854df45e9018b1353c39e014f31411868d0e81))
- **app:** add generating tables ([60eb149](https://github.com/lecle/aloxide/commit/60eb149368d6bbad939abb93b2713afb3d94568d))
- **bridge:** :sparkles: add sequelize model adapter ([e8c4a06](https://github.com/lecle/aloxide/commit/e8c4a069e6c095c76be46ff5c9af37710bdf4ffd))
- **bridge:** :sparkles: create table method template for ICON ([#30](https://github.com/lecle/aloxide/issues/30)) ([7ac784a](https://github.com/lecle/aloxide/commit/7ac784ad443d6574b72b18a6e7c43374800a31fe))
