import type { EntityConfig } from '@aloxide/bridge';
import type { BlockInfo } from 'demux';

export type DMeta = {
  entity: EntityConfig;
  blockInfo?: BlockInfo;
};
