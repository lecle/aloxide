import { Request, Response } from 'express';

export interface HandleRequest {
  handle(req: Request, res: Response): any;
}
