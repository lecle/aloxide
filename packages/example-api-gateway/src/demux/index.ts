import { AbstractActionHandler, BaseActionWatcher, HandlerVersion } from 'demux';
import { NodeosActionReader } from 'demux-eos';

import { ActionHandler } from './ActionHandler';
import { BaseHandlerVersion } from './BaseHandlerVersion';
import { DbCreUpdater } from './DbCreUpdater';
import { DbDelUpdater } from './DbDelUpdater';
import { DbUpdUpdater } from './DbUpdUpdater';
import { LogEffect } from './LogEffect';
import { LogUpdater } from './LogUpdater';

const versionName = 'v1';
const handlerVersion: HandlerVersion = new BaseHandlerVersion(
  versionName,
  [
    new LogUpdater('helloworld12::hi'),

    new DbCreUpdater({
      actionType: 'helloworld12::crepoll',
      modelName: 'Poll',
    }),
    new DbCreUpdater({
      actionType: 'helloworld12::crevote',
      modelName: 'Vote',
    }),

    new DbUpdUpdater({
      actionType: 'helloworld12::updpoll',
      modelName: 'Poll',
    }),
    new DbUpdUpdater({
      actionType: 'helloworld12::updvote',
      modelName: 'Vote',
    }),

    new DbDelUpdater({
      actionType: 'helloworld12::delpoll',
      modelName: 'Poll',
    }),
    new DbDelUpdater({
      actionType: 'helloworld12::delvote',
      modelName: 'Vote',
    }),
  ],

  [new LogEffect()],
);

// See supported Action Handlers here: https://github.com/EOSIO/demux-js#class-implementations
const actionHandler: AbstractActionHandler = new ActionHandler(handlerVersion);

const actionReader = new NodeosActionReader({
  startAtBlock: -10, // startAtBlock: the first block relevant to our application
  onlyIrreversible: false, // onlyIrreversible: whether or not to only process irreversible blocks
  nodeosEndpoint: 'https://devnet.canfoundation.io',
});

export const actionWatcher = new BaseActionWatcher(actionReader, actionHandler, 500);
