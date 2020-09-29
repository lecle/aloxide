import type { EntityConfig } from '@aloxide/bridge';
import type { BlockInfo } from 'demux';
import type { AloxideActionHandlerContext } from './AloxideActionHandler';
import { DbUpdaterActionPayload } from './DbUpdater';

export type DMeta = {
  entity: EntityConfig;
  blockInfo?: BlockInfo;
  context?: AloxideActionHandlerContext;
  payload?: DbUpdaterActionPayload;
};
