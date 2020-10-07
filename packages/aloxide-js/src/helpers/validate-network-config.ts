
export function validateNetworkConfig(config) {
  if (!config) {
    throw new Error('Missing network config!');
  }

  const requiredKeys = 'name,type,protocol,host,port,chainId,coreToken'.trim().split(',').sort();
  const keys = Object.keys(config).sort();

  const missingKeys = requiredKeys.filter(requiredKey => !keys.includes(requiredKey));

  if (missingKeys.length > 0) {
    throw new Error(`Missing required configs: ${missingKeys.map(k=> {return `"${k}"`}).join(', ')}`)
  }
};
