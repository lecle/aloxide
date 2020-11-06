<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Change Log](#change-log)
- [0.4.0 (2020-11-06)](#040-2020-11-06)
  - [Bug Fixes](#bug-fixes)
  - [Features](#features)
- [0.3.0 (2020-10-28)](#030-2020-10-28)
  - [Features](#features-1)
  - [0.2.1 (2020-09-29)](#021-2020-09-29)
    - [Bug Fixes](#bug-fixes-1)
- [0.2.0 (2020-09-25)](#020-2020-09-25)
  - [Bug Fixes](#bug-fixes-2)
  - [Features](#features-2)
  - [BREAKING CHANGES](#breaking-changes)
- [0.1.0 (2020-09-03)](#010-2020-09-03)
  - [Bug Fixes](#bug-fixes-3)
  - [Features](#features-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/lecle/aloxide/compare/v0.3.0...v0.4.0) (2020-11-06)

### Bug Fixes

- **abstraction:** :bug: remove redundant parameter ([b8b778a](https://github.com/lecle/aloxide/commit/b8b778a7c7325d11a7eeb419674626fe8d8c2edf))

### Features

- **abstraction:** :sparkles: separate the eos and can builder ([afeddc2](https://github.com/lecle/aloxide/commit/afeddc20b9050e0e44071c129e3a11517747c7c8))

# [0.3.0](https://github.com/lecle/aloxide/compare/v0.2.1...v0.3.0) (2020-10-28)

### Features

- **abstraction:** :sparkles: add command-line tool for generateing smart contract ([c523a72](https://github.com/lecle/aloxide/commit/c523a72a20172767777fe0da7153c26b06644e90))

## [0.2.1](https://github.com/lecle/aloxide/compare/v0.2.0...v0.2.1) (2020-09-29)

### Bug Fixes

- **abstraction:** :fire: remove `validate` since we don't need it ([fe0ca77](https://github.com/lecle/aloxide/commit/fe0ca77880c312f7cc080441bf50e19f1c6aa05f))

# 0.2.0 (2020-09-25)

### Bug Fixes

- **abstraction:** :art: fix variable naming ([a37fdf3](https://github.com/lecle/aloxide/commit/a37fdf3479293727aa196c1d5f832a0d728f6182))
- **abstraction:** :bug: fix case of letter in `utils` ([792062b](https://github.com/lecle/aloxide/commit/792062b24a5315fead0034846f5c00a9f119c595))
- **abstraction:** :fire: fix removing @aloxide/logger ([f609e74](https://github.com/lecle/aloxide/commit/f609e74635d4f3748bc7d8d036636845b6d2f7dd))
- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **app:** :lipstick: remove redundant log debug of config.adapter ([7ba20b9](https://github.com/lecle/aloxide/commit/7ba20b9b7daddf762312896c7ea51f8af040174a))
- **chore:** change/update license to valid string ([120e0ed](https://github.com/lecle/aloxide/commit/120e0edad9077ece50aedbe18789392aefb3e6ef))
- **logger:** :fire: remove success function in the Logger interface ([4765a3a](https://github.com/lecle/aloxide/commit/4765a3a1e11df495007a7bc5cd045cb78a116b18))
- **setup:** :fire: update public access ([69965d5](https://github.com/lecle/aloxide/commit/69965d52a71494cd1de28bf1a717886f988767a4))
- **setup:** :wrench: update configuring of running test unit ([7d92c88](https://github.com/lecle/aloxide/commit/7d92c888b70ccf38816fb762d32145e88a5cb6fb))

- refactor(example-generante-sm)!: :art: change variable name from `resultPath` to `outputPath` ([15e97a4](https://github.com/lecle/aloxide/commit/15e97a47595b4033e41bf7c4d3a40241352e725b))

### Features

- **abstraction:** :sparkles: add option logDataOnly ([fcd80fa](https://github.com/lecle/aloxide/commit/fcd80fa0f2a033cc7dbf29d6033aab3337ad7e06))
- **abstraction:** add more test case and code coverage ([243c344](https://github.com/lecle/aloxide/commit/243c344f0d7c5fee9a4a70c3487930d98f9f0609))
- **api-gateway:** :package: add api-gateway and example ([9fc7729](https://github.com/lecle/aloxide/commit/9fc7729738a76cae992da06c5240f56756ffdd9d))
- **app:** :robot: add supported actions ([178d977](https://github.com/lecle/aloxide/commit/178d977e586b5fb520f009e406f239f6404732c9))
- **app:** :sparkles: remove samples and add bridge + abstraction ([848a10d](https://github.com/lecle/aloxide/commit/848a10db28f04a7e541246eccf0fe2a6861cdc45))
- **app:** add generating tables ([60eb149](https://github.com/lecle/aloxide/commit/60eb149368d6bbad939abb93b2713afb3d94568d))
- **bastraction:** validate entities ([d597466](https://github.com/lecle/aloxide/commit/d597466ba0ee43fcc108566a3a82e8015e9e4f79))

### BREAKING CHANGES

- - update ContractGeneratorConfig

# 0.1.0 (2020-09-03)

### Bug Fixes

- **app:** :lipstick: fix dependency ([8a9661a](https://github.com/lecle/aloxide/commit/8a9661a99d5d6e3598eea1629e7223b9ba60250d))
- **app:** :lipstick: remove redundant log debug of config.adapter ([7ba20b9](https://github.com/lecle/aloxide/commit/7ba20b9b7daddf762312896c7ea51f8af040174a))

### Features

- **api-gateway:** :package: add api-gateway and example ([9fc7729](https://github.com/lecle/aloxide/commit/9fc7729738a76cae992da06c5240f56756ffdd9d))
- **app:** :robot: add supported actions ([178d977](https://github.com/lecle/aloxide/commit/178d977e586b5fb520f009e406f239f6404732c9))
- **app:** :sparkles: remove samples and add bridge + abstraction ([848a10d](https://github.com/lecle/aloxide/commit/848a10db28f04a7e541246eccf0fe2a6861cdc45))
- **app:** add generating tables ([60eb149](https://github.com/lecle/aloxide/commit/60eb149368d6bbad939abb93b2713afb3d94568d))
- **bastraction:** validate entities ([d597466](https://github.com/lecle/aloxide/commit/d597466ba0ee43fcc108566a3a82e8015e9e4f79))
