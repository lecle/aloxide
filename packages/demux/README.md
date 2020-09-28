<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Package `@aloxide/demux`](#package-aloxidedemux)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Package `@aloxide/demux`

Implement demux pattern for sync data from blockchain to a centralized database.

## Usage

[real samples](../example-api-gateway/src/readBlockchain.ts)

[**`ExpressActionWatcher`**](https://github.com/EOSIO/demux-js/blob/develop/src/ExpressActionWatcher.ts): Exposes the API methods from the `BaseActionWatcher` through an Express server.

```javascript
const expressWatcher = new ExpressActionWatcher(
  actionReader,
  actionHandler,
  pollInterval,
  portNumber,
);

expressWatcher.listen();
```

Now you can start watching for block data by making `POST /start` request, and to stop receiving block data by making `POST /pause` request. Between these requests, `actionReader` will read block data from the blockchain and passing it to `actionHandler`.

[**`AloxideActionWatcher`**](https://github.com/lecle/aloxide/blob/master/packages/demux/src/AloxideActionWatcher.ts): A ready-to-use action watcher with ability to get only one block per request e.g. using in a lambda function.

Call `watchOnce` to read data of only one block (specified by `startAtBlock` option), for example when you want to read the blockchain once per lambda invocation.

```javascript
const actionWatcher = new AloxideActionWatcher(actionReader, actionHandler, 1000);
await actionWatcher.watchOnce(); // `actionHandler` will be run once
```
