<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Change Log](#change-log)
- [0.3.0 (2020-10-28)](#030-2020-10-28)
  - [Bug Fixes](#bug-fixes)
  - [0.2.1 (2020-09-29)](#021-2020-09-29)
- [0.2.0 (2020-09-25)](#020-2020-09-25)
  - [Bug Fixes](#bug-fixes-1)
  - [Features](#features)
- [0.1.0 (2020-09-03)](#010-2020-09-03)
  - [Bug Fixes](#bug-fixes-2)
  - [Features](#features-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.3.0](https://github.com/lecle/aloxide/compare/v0.2.1...v0.3.0) (2020-10-28)

### Bug Fixes

- **example-api-gateway:** :bug: update configuration of model builder ([280b349](https://github.com/lecle/aloxide/commit/280b3493ea2bdb009688655ab54cd5c9d27714a7))

## [0.2.1](https://github.com/lecle/aloxide/compare/v0.2.0...v0.2.1) (2020-09-29)

**Note:** Version bump only for package @aloxide/example-api-gateway

# 0.2.0 (2020-09-25)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **chore:** change/update license to valid string ([120e0ed](https://github.com/lecle/aloxide/commit/120e0edad9077ece50aedbe18789392aefb3e6ef))
- **demux:** :bug: initialize started block with the lastest processed block ([0d24040](https://github.com/lecle/aloxide/commit/0d24040f6717a3c649d962277d96535797c470c7))
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
- **setup:** :wrench: update configuring of running test unit ([7d92c88](https://github.com/lecle/aloxide/commit/7d92c888b70ccf38816fb762d32145e88a5cb6fb))

### Features

- **example-api-gateway:** :sparkles: apply change from model-squelize ([0cb164a](https://github.com/lecle/aloxide/commit/0cb164a3bd7c5f5e3342021dc4a1e57065c353bd))
- add AloxideActionWatcher to watch blockchain once (read one block and exit) ([#47](https://github.com/lecle/aloxide/issues/47)) ([8037b36](https://github.com/lecle/aloxide/commit/8037b365f6de16396de1e82cc1003ff5baf0ebed))
- **api-gateway:** :package: add api-gateway and example ([9fc7729](https://github.com/lecle/aloxide/commit/9fc7729738a76cae992da06c5240f56756ffdd9d))
- **app:** :zap: add dummy data for testing server ([4a37ed3](https://github.com/lecle/aloxide/commit/4a37ed3b23b954ddffd6e45c17cc908533979fa6))
- **example-api-gateway:** :sparkles: add watcher on iconloop ([9de0ae6](https://github.com/lecle/aloxide/commit/9de0ae6bd5f8c568e7d21efd3d4606f0e588a81d))

# 0.1.0 (2020-09-03)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **demux:** :bug: initialize started block with the lastest processed block ([0d24040](https://github.com/lecle/aloxide/commit/0d24040f6717a3c649d962277d96535797c470c7))
- **example-api-gateway:** :bug: load data from env file ([8fe83a1](https://github.com/lecle/aloxide/commit/8fe83a1ebcf83fb0d81cc38dbc01311a2dfbdd01)), closes [/github.com/lecle/aloxide/pull/16#discussion_r471207441](https://github.com//github.com/lecle/aloxide/pull/16/issues/discussion_r471207441)
- **example-api-gateway:** :bug: remove unused code ([a463245](https://github.com/lecle/aloxide/commit/a463245ad36387313066cda88016ed0a5e95cb54)), closes [/github.com/lecle/aloxide/pull/16#discussion_r471211080](https://github.com//github.com/lecle/aloxide/pull/16/issues/discussion_r471211080)
- **example-api-gateway:** :bulb: fix start script so it does not block global start ([bf6b2e9](https://github.com/lecle/aloxide/commit/bf6b2e946b42e026996d6e8523f9f616195b05ed))

### Features

- **api-gateway:** :package: add api-gateway and example ([9fc7729](https://github.com/lecle/aloxide/commit/9fc7729738a76cae992da06c5240f56756ffdd9d))
- **app:** :zap: add dummy data for testing server ([4a37ed3](https://github.com/lecle/aloxide/commit/4a37ed3b23b954ddffd6e45c17cc908533979fa6))
