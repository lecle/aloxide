export interface Jsonrpc20<R> {
  jsonrpc: string;
  id: number;
  result?: R;
  error?: {
    code: number;
    message: string;
  }
}
