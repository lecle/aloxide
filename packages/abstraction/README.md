<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Package `@aloxide/abstraction`](#package-aloxideabstraction)
  - [Usage](#usage)
  - [Aloxide client](#aloxide-client)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Package `@aloxide/abstraction`

Provide tool for generating smart-contract

## Usage

[../example-generate-sm/src/index.ts](../example-generate-sm/src/index.ts)

## Aloxide client

After install `@aloxide/abstraction`, there will be an Aloxide client accompanied. You can use as example below:

```bash
# help
yarn aloxide -h

# create smart contract
yarn aloxide create ./test/aloxide.yml -o ./out

# use adapter eos
# ---- success generating file: hello.cpp
# ---- success generating file: hello.hpp
# generate smart contract success fully

# see output files at: `./out`
```

Or if you install `@aloxide/abstraction` as a global package, the command will be available on the terminal without need of `yarn`

```bash
# help
aloxide -h

# create smart contract
aloxide create ./test/aloxide.yml -o ./out

# use adapter eos
# ---- success generating file: hello.cpp
# ---- success generating file: hello.hpp
# generate smart contract success fully

# see output files at: `./out`
```
