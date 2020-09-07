# Example generate smart-contract

Working environment

```text
$ node -v
v12.13.0 (it should work with the verion >= v10)
npm i -g yarn
```

## Start

```bash
# install dependencies
yarn

# start
yarn start
```

## Output

```text
yarn run v1.22.5
$ rimraf ./out
$ ts-node -P ./tsconfig.json src/index.ts | bunyan -o short
07:19:48.723Z DEBUG g: -- config.aloxideConfigPath ./samples/aloxide.yml
07:19:48.724Z DEBUG g: -- config.resultPath ./out
07:19:48.731Z  INFO g: Schema Validated Successfully
07:19:48.731Z DEBUG g: output path is: ./out, blockchain type: eos
07:19:48.766Z DEBUG g: make directory: ./out/eos
07:19:48.766Z  INFO g: ---- success generating file: hello.cpp
07:19:48.785Z  INFO g: ---- success generating file: hello.hpp
07:19:48.785Z DEBUG g: output path is: ./out, blockchain type: icon
07:19:48.789Z DEBUG g: make directory: ./out/icon/icon_hello
07:19:48.789Z  INFO g: ---- success generating file: __init__.py
07:19:48.791Z  INFO g: ---- success generating file: package.json
07:19:48.825Z  INFO g: ---- success generating file: icon_hello.py
07:19:48.832Z  INFO g: ---- success generating file: getPoll.json
07:19:48.834Z  INFO g: ---- success generating file: getVote.json
07:19:48.837Z  INFO g: ---- success generating file: crtPoll.json
07:19:48.838Z  INFO g: ---- success generating file: uptPoll.json
07:19:48.838Z  INFO g: ---- success generating file: rmvPoll.json
07:19:48.839Z  INFO g: ---- success generating file: crtVote.json
07:19:48.840Z  INFO g: ---- success generating file: uptVote.json
07:19:48.841Z  INFO g: ---- success generating file: rmvVote.json
07:19:48.841Z DEBUG g: output path is: ./out, blockchain type: sequelize
07:19:48.845Z DEBUG g: make directory: ./out/sequelize
07:19:48.846Z  INFO g: ---- success generating file: bbModelBuilder.js
```

# Using t-bears docker

- install docker

When you run `docker -v` it will look like below

```text
$ docker -v
Docker version 19.03.8, build afacb8b
```

- make docker image **iconloop/t-bears**

```bash
docker build -t iconloop/t-bears -f docker-tbears.Dockerfile .
```

- make `tbears` command to be available in current shell

```bash
source ./utils.sh

# testing
tbears lastblock
```

Note that default `tbears` interacts with current folder `-v $(pwd):/app`. It means you can change configuration of tbears command by editing this file [tbears_cli_config](./tbears_cli_config).
