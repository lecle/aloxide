export interface Jsonrpc20<R> {
  jsonrpc: string;
  result: R;
  id: number;
}
