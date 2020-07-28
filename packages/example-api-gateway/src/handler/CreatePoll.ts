import { AbsHandleRequest, apiGateway, HandleRequest } from '@aloxide/api-gateway';
import { Request, Response } from 'express';

import config from '../config';

export class CreatePoll extends AbsHandleRequest implements HandleRequest {
  handleRequest(req: Request, res: Response, next) {
    const Poll = apiGateway.models['Poll'];

    Poll.create({
      name: 'poll',
      body: 'poll body',
    })
      .then(item => {
        config.logger.debug('created item:', item?.toJSON());
        res.send('created poll!');
      })
      .catch(err => next(err));
  }
}
