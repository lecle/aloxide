# `demux-icon`

`demux-icon` is an implementation of [demux](https://www.npmjs.com/package/demux) for ICON network

## Usage

```javascript
const { IconActionReader } = require('demux-js');

const actionReader = new IconActionReader({
  startAtBlock: 4194850,
  onlyIrreversible: false,
  endpoint: 'https://bicon.net.solidwallet.io/api/v3',
  nid: 3,
  jsonrpc: '2.0',
  logSource: 'IconActionReader',
  logLevel: 'info',
});
```

## Example

[example.ts](./src/example.ts)

```
node version: >= v10
npm i -g yarn
yarn start
```
