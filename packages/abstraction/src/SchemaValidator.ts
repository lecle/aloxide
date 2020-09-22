import fs from 'fs';
import Schema from 'validate';

import SchemaBuilder from './lib/SchemaBuilder';
import { loadContent, printErrors } from './lib/Utils';
import { Logger } from './Logger';

/**
 * Validate Entity Schema
 * @param entities
 * @param logger
 */
export function validateEntity(entities, logger) {
  const requiredSchema = {
    entities: [
      {
        name: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
        fields: [
          {
            name: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
            type: { type: String, required: true, use: { checkType } },
          },
        ],
        key: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
      },
    ],
  };
  const schemaErrors = validateSchema(entities, requiredSchema, logger);

  return schemaErrors.length < 1;
}

/**
 * Strict Name validation, apply to all blockchains
 * @param val
 */
export function checkName(val) {
  return /^[1-5a-zA-Z]+/.test(val);
}

/**
 * Strict Type validation, apply to all blockchains
 * @param val
 */
function checkType(val) {
  const supportedType = ['uint64_t', 'number', 'string', 'array', 'bool'];
  return supportedType.indexOf(val) !== -1;
}

export function validateSchema(targetObject, inputSchema = {}, logger?: Logger) {
  const isPath = typeof targetObject === 'string';
  if (isPath ? !fs.existsSync(targetObject) : typeof targetObject !== 'object')
    return logger?.error('Target must be either be an object or a valid filepath');

  try {
    const schema = SchemaBuilder.getSchema(inputSchema);
    const content = isPath ? loadContent(targetObject) : targetObject;
    const clone = JSON.parse(JSON.stringify(content));
    const misMatches = new Schema(schema)
      .validate(content)
      .map(err => ({ path: err.path, message: err.message }));
    const extraFiels = validateExtraFields(clone, schema);
    return printErrors(misMatches, extraFiels, logger);
  } catch (error) {
    logger?.error(error);
  }
}

function validateExtraFields(targetObj, schemaObj) {
  const extras = [];

  const leafNode = obj => {
    return (
      obj && ([String, Number, Boolean].includes(obj.type) || typeof obj.required === 'boolean')
    );
  };

  const _parseTarget = (target, schema, parsedLevel = '') => {
    if (typeof target !== 'object') {
      return;
    }

    const targetKeys = Object.keys(target);

    for (const key of targetKeys) {
      const schemaKey = target instanceof Array ? schema[0] : schema[key];
      const nextLevel = parsedLevel ? `${parsedLevel}.${key}` : key;

      if (!schemaKey || (typeof target[key] !== 'object' && !leafNode(schemaKey))) {
        extras.push({ path: nextLevel, message: `${nextLevel} is not present in schema` });
      } else {
        _parseTarget(target[key], schemaKey, nextLevel);
      }
    }
  };

  _parseTarget(targetObj, schemaObj);
  return extras;
}
