import type { EntityConfig } from '@aloxide/bridge';
import type { BlockInfo } from 'demux';
import type { AloxideActionHandlerContext } from './AloxideActionHandler';

export type DMeta = {
  entity: EntityConfig;
  blockInfo?: BlockInfo;
  context?: AloxideActionHandlerContext;
};
