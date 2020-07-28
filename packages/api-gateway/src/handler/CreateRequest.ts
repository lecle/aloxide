import { IncomingMessage, ServerResponse } from 'http';

import { AbsHandleRequest } from './AbsHandleRequest';

export class CreateRequest extends AbsHandleRequest {
  handleRequest(req: IncomingMessage, res: ServerResponse): void {
    throw new Error('Method not implemented.');
  }
}
