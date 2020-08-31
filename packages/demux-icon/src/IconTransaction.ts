import { Prep } from './Prep';
import { Hex } from './Hex';

export type DataType = 'base' | 'call' | 'deploy' | 'message';

export interface BaseData {
  prep: Prep;
  result: {
    coveredByFee: Hex;
    coveredByOverIssuedICX: Hex;
    issue: Hex;
  };
}

export interface IconBaseTransaction<Data = BaseData> {
  version: Hex;
  timestamp: Hex;
  dataType: DataType;

  /**
   * The detailed content of the transaction. It varies depending on the data type. The maximum size of data is 512 KB.
   */
  data: Data;
  txHash: Hex;
}

export interface DataCall<P> {
  method: string;
  params: P;
}

export interface IconTransaction<Data = DataCall<any>> extends IconBaseTransaction<Data> {
  from: string;
  to: string;
  stepLimit: Hex;
  nid: Hex;
  value: Hex;
  nonce: Hex;
  signature: string;
}
