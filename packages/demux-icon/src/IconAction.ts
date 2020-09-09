import { Action } from 'demux';

import { Hex } from './Hex';
import { IconTransaction } from './IconTransaction';

export interface IconPayload<Param> extends IconTransaction<Param> {
  version: Hex;
  producer: string;
  transactionId: string;
  actionIndex: number;
}

export interface IconAction<ActionStruct = any> extends Action {
  payload: IconPayload<ActionStruct>;
}
