import fs from 'fs';
import yaml from 'js-yaml';

import { Logger } from './Logger';

import type { AloxideConfig } from './AloxideConfig';

export function readAloxideConfig(aloxideConfigPath: string, logger?: Logger): AloxideConfig {
  if (!aloxideConfigPath) {
    throw new Error('missing aloxideConfigPath');
  }

  if (!fs.existsSync(aloxideConfigPath)) {
    throw new Error(`file [${aloxideConfigPath}] does not exist`);
  }

  const lowerCaseName = aloxideConfigPath.toLowerCase();

  let aloxideConfig: AloxideConfig;

  if (lowerCaseName.endsWith('.json')) {
    logger?.debug('parsing aloxide config with JSON format');

    // parse json
    aloxideConfig = JSON.parse(fs.readFileSync(aloxideConfigPath, 'utf8'));
  } else if (lowerCaseName.endsWith('.yml') || lowerCaseName.endsWith('.yaml')) {
    logger?.debug('parsing aloxide config with YAML format');

    // parse yaml|yml
    aloxideConfig = yaml.safeLoad(fs.readFileSync(aloxideConfigPath, 'utf8'));
  } else {
    throw new Error(`unknow file extention of file: [${aloxideConfigPath}]`);
  }

  return aloxideConfig;
}
