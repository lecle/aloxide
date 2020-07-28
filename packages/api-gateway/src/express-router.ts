import express from 'express';

import { appConfig } from './appConfig';
import { CreateRequest } from './handler/CreateRequest';
import { GetRequest } from './handler/GetRequest';

function createRouter() {
  const expressRouter = express.Router();

  // middleware that is specific to this router
  expressRouter.use(function timeLog(req, res, next) {
    appConfig.logger.debug('Time: ', Date.now());
    next();
  });

  // define the home page route
  expressRouter.get('/', (req, res) => new GetRequest().handle(req, res));

  // create item
  expressRouter.post('/', (req, res) => new CreateRequest().handle(req, res));

  return expressRouter;
}

export { createRouter };
