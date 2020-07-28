import { apiGatewayConfig, generateSmartContract } from '@aloxide/api-gateway';

import config from './config';

apiGatewayConfig.configure(config);
generateSmartContract();
