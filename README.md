<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Aloxide](#aloxide)
- [Getting started](#getting-started)
- [How to build](#how-to-build)
  - [Development Environment](#development-environment)
  - [Bootstrap the Project](#bootstrap-the-project)
- [Links](#links)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/lecle/aloxide/branch/master/graph/badge.svg?token=SMZFZL7G6C)](https://codecov.io/gh/lecle/aloxide)
[![Build Status](https://travis-ci.org/lecle/aloxide.svg?branch=master)](https://travis-ci.org/lecle/aloxide)

# Aloxide

While there are a lot of blockchain softwares available and it's not uncommon to see a requirement to support various blockchains, it still requires a significant amount of time to learn how to write a smart contract just printing "Hello World" per blockchain. Aloxide provides a pragmatic abstraction for various blockchain softwares including CAN, EOS, ICON, and so on so that you can focus on business logic on smart contracts without ties to specific blockchain natures. Also based on the abstraction Aloxide offers useful tool-kits for dApp development such as API gateway and SDK.

# Getting started

Check out the [working example using Aloxide API gateway](https://github.com/lecle/aloxide/blob/master/packages/example-api-gateway/README.md).

[Gitpod](https://www.gitpod.io/) is an online open source VS Code-like IDE (and is free for open source projects) for working on issues and making PRs to this project. With a single click it will start a workspace automatically.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/lecle/aloxide)

# How to build

## Development Environment

Aloxide project requires Node.js 10 and above and `yarn` and `lerna` as global depdencies.

```bash
npm i -g yarn
npm i -g lerna
```

## Bootstrap the Project

```bash
npx lerna bootstrap

# Build project
yarn build

# after build project you can
## try unit test
yarn test

## or try start
yarn start
```

Output of the `yarn start` will look like bellow:

```text
lerna run start
lerna notice cli v3.22.1
lerna info versioning independent
lerna info Executing command in 1 package: "yarn run start"
lerna info run Ran npm script 'start' in '@aloxide/example-generate-sm' in 0.6s:
$ rimraf ./out
$ node ./dist/index.js
-- config.aloxideConfigPath [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/samples/aloxide.yml
-- config.resultPath [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out
parsing aloxide config with YAML format
aloxide config: {
  entities: [
    { name: 'Poll', fields: [Array], key: 'id' },
    { name: 'Vote', fields: [Array], key: 'id' }
  ]
}
output path is: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out, blockchain type: eos
make directory: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/eos
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/eos/hello.cpp
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/eos/hello.hpp
output path is: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out, blockchain type: icon
make directory: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/hi_icon.json
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/icon_hello.py
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/__init__.py
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/package.json
make directory: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/tests
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/tests/test_unit_icon_hello.py
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/tests/__init__.py
---- success generating file: [PROJECT-DIRECTORY]/aloxide/packages/example-generate-sm/out/icon/icon_hello/tests/test_integrate_icon_hello.py
lerna success run Ran npm script 'start' in 1 package in 0.6s:
lerna success - @aloxide/example-generate-sm
```

# Links

- [Medium](https://medium.com/@Aloxide)
- [Google Groups](https://groups.google.com/g/aloxide)

# License

[Apache License 2.0](./LICENSE)
