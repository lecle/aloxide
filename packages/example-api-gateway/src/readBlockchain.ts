import { apiGateway, apiGatewayConfig } from '@aloxide/api-gateway';

import config from './config';
import { actionWatcher } from './demux';

apiGatewayConfig.configure(config);
apiGateway.init();

actionWatcher.watch();
