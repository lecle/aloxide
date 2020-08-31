import { Action } from 'demux';
import { IconTransaction, DataCall } from './IconTransaction';
import { Hex } from './Hex';

export interface IconPayload<Param> extends IconTransaction<DataCall<Param>> {
  version: Hex;
}

export interface IconAction<ActionStruct = any> extends Action {
  payload: IconPayload<ActionStruct>;
}
