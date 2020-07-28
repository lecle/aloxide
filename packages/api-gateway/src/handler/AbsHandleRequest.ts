import { Request, Response } from 'express';

import { HandleRequest } from './HandleRequest';

export abstract class AbsHandleRequest implements HandleRequest {
  handle(req: Request, res: Response): any {
    this.handleRequest(req, res);
  }

  abstract handleRequest(req: Request, res: Response, next?: any): any;
}
