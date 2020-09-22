import fs = require('fs');
import yaml = require('js-yaml');

import { Logger } from '../Logger';

export function loadContent(filePath) {
  if (!/json|yml|yaml$/.test(filePath)) {
    throw new Error('Schema file format not supportes. Supported formats : json|yml|yaml');
  }
  const content = fs.readFileSync(filePath);
  return /json$/.test(filePath) ? JSON.parse(content.toString()) : yaml.safeLoad(content);
}

export function printErrors(errors, warnings, logger?: Logger) {
  logger?.info('====== Schema Validation ======');

  if (errors.length) {
    logger?.error(`${errors.length} mismatches and ${warnings.length} warnings found.`);
    errors.forEach((err, index) => logger?.error(`${index + 1}. ${err.message}`));
  }

  if (warnings.length) {
    warnings.forEach((warn, index) => logger?.warn(`${index + 1}. ${warn.message}`));
  }

  logger?.info('Schema Validated Successfully');
  return errors.concat(warnings);
}

export function getType(object) {
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}
