import { AbsHandleRequest, apiGateway, HandleRequest } from '@aloxide/api-gateway';
import { IncomingMessage, ServerResponse } from 'http';

export class CreateVote extends AbsHandleRequest implements HandleRequest {
  handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const model = apiGateway.models['Vote'];
  }
}
