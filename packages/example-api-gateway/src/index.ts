import { apiGateway, apiGatewayConfig } from '@aloxide/api-gateway';

import config from './config';
import { CreatePoll } from './handler/CreatePoll';

const logger = config.logger;

const express = require('express');
const app = express();
const port = 4000;

apiGatewayConfig.configure(config);
const apiGatewayRouter = apiGateway.init();

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api-gateway', apiGatewayRouter);

app.post('/poll', (req, res) => {
  const h = new CreatePoll();
  //@ts-ignore
  h.handle(req, res);
});

app.listen(port, () => {
  logger.log(`Example app listening at http://localhost:${port}`);
});
