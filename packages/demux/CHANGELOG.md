<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Change Log](#change-log)
- [0.5.0 (2020-11-10)](#050-2020-11-10)
  - [Bug Fixes](#bug-fixes)
- [0.4.0 (2020-11-06)](#040-2020-11-06)
  - [Bug Fixes](#bug-fixes-1)
  - [Features](#features)
- [0.3.0 (2020-10-28)](#030-2020-10-28)
  - [Bug Fixes](#bug-fixes-2)
  - [0.2.1 (2020-09-29)](#021-2020-09-29)
    - [Bug Fixes](#bug-fixes-3)
    - [Features](#features-1)
- [0.2.0 (2020-09-25)](#020-2020-09-25)
  - [Bug Fixes](#bug-fixes-4)
  - [Features](#features-2)
  - [BREAKING CHANGES](#breaking-changes)
- [0.1.0 (2020-09-03)](#010-2020-09-03)
  - [Bug Fixes](#bug-fixes-5)
  - [Features](#features-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/lecle/aloxide/compare/v0.4.0...v0.5.0) (2020-11-10)

### Bug Fixes

- **demux:** :bug: handler version type as index need to have fix length ([556318f](https://github.com/lecle/aloxide/commit/556318f355b33a425aa3d64019c9b7a7b6b57697))

# [0.4.0](https://github.com/lecle/aloxide/compare/v0.3.0...v0.4.0) (2020-11-06)

### Bug Fixes

- **chore:** ignore ts ([f368768](https://github.com/lecle/aloxide/commit/f36876892fb98a5f9dd7c1e4ceb5e0882d01af70))

### Features

- **chore:** enhance unit test ([#109](https://github.com/lecle/aloxide/issues/109)) ([c14e84c](https://github.com/lecle/aloxide/commit/c14e84cbbf005e00bdfaa2873e461d15bfe3f8fa))

# [0.3.0](https://github.com/lecle/aloxide/compare/v0.2.1...v0.3.0) (2020-10-28)

### Bug Fixes

- **demux:** :bug: typo in file name ([7485a04](https://github.com/lecle/aloxide/commit/7485a044e7eb9316bcf42c88567ddc26f41aa0f7))

## [0.2.1](https://github.com/lecle/aloxide/compare/v0.2.0...v0.2.1) (2020-09-29)

### Bug Fixes

- **demux:** :white_check_mark: fix unit test of DbUpdater.ts ([c37b003](https://github.com/lecle/aloxide/commit/c37b003c0b130b8a33d7e2d9cfddf92330b82df3))

### Features

- **demux:** :sparkles: [#89](https://github.com/lecle/aloxide/issues/89) add the payload to metadata so that we can get ([b6b399f](https://github.com/lecle/aloxide/commit/b6b399ffb35eebb5ed6b0d3ad2618f2427003cf8))
- **demux:** :sparkles: export BaseHandlerVersion ([e0c52c0](https://github.com/lecle/aloxide/commit/e0c52c04bbb909ab1c7fe72c3e91137d9b46cebe))

# 0.2.0 (2020-09-25)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
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
- **setup:** :fire: update public access ([69965d5](https://github.com/lecle/aloxide/commit/69965d52a71494cd1de28bf1a717886f988767a4))
- **setup:** :wrench: update configuring of running test unit ([7d92c88](https://github.com/lecle/aloxide/commit/7d92c888b70ccf38816fb762d32145e88a5cb6fb))

### Features

- **app:** :zap: add dummy data for testing server ([4a37ed3](https://github.com/lecle/aloxide/commit/4a37ed3b23b954ddffd6e45c17cc908533979fa6))
- **demux:** :ambulance: export createDbUpdater for better supporting customization ([1741e06](https://github.com/lecle/aloxide/commit/1741e064debbcff9e85cdef41edf93cf751bfc9f))
- **demux:** :fire: remove dependency on sequelize ([3ee036c](https://github.com/lecle/aloxide/commit/3ee036c2b1287de2baf30fd524e7ca3d0112ec83))
- **demux:** :poop: change option and params of AloxideActionHandler ([683ccad](https://github.com/lecle/aloxide/commit/683ccad7f14888e783c28503910478a265cc95ae))
- **demux:** :sparkles: add blockchain name to option ([695c84c](https://github.com/lecle/aloxide/commit/695c84c8c38b649d36c6d5971d3bcbe2e659e797))
- **demux:** :sparkles: introduce AloxideDataManager ([ff9de21](https://github.com/lecle/aloxide/commit/ff9de212bdea77ff6a77f48de888dfdcd7c8e6f4))
- **demux:** :sparkles: update DataAdapter support query count and findAll ([44fc411](https://github.com/lecle/aloxide/commit/44fc41122b7c2dde88431366056a85ede54d2095))
- **demux:** :zap: change option handlerVersions to array ([5a390b6](https://github.com/lecle/aloxide/commit/5a390b62ad475787bd36da28346cd8a722d682ac))
- add AloxideActionWatcher to watch blockchain once (read one block and exit) ([#47](https://github.com/lecle/aloxide/issues/47)) ([8037b36](https://github.com/lecle/aloxide/commit/8037b365f6de16396de1e82cc1003ff5baf0ebed))

- refactor(demux)!: :rotating_light: remove dependency on demux-eos ([d826b54](https://github.com/lecle/aloxide/commit/d826b545b05f397f8dacfae46cc5be469ca532ab))

### BREAKING CHANGES

- - option `actionReader` become require
- remove option `nodeActionReaderOptions`

# 0.1.0 (2020-09-03)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **demux:** :bug: initialize started block with the lastest processed block ([0d24040](https://github.com/lecle/aloxide/commit/0d24040f6717a3c649d962277d96535797c470c7))

### Features

- **app:** :zap: add dummy data for testing server ([4a37ed3](https://github.com/lecle/aloxide/commit/4a37ed3b23b954ddffd6e45c17cc908533979fa6))
