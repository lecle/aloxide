import fs from 'fs'
import Schema from 'validate'
import SchemaBuilder from "./lib/SchemaBuilder"
import { loadContent, printErrors } from './lib/Utils'
import { Logger } from '@aloxide/Logger';

const logLevels = {
  none: 0,
  error: 1,
  warn: 2,
  verbose: 3
}

export function validateSchema(targetObject, inputSchema = {}, logger?: Logger, logLevel = 3){

  const isPath = typeof targetObject === 'string'
  if(isPath ? !fs.existsSync(targetObject) : typeof targetObject !== 'object')
    return logger?.error('Target must be either be an object or a valid filepath');

  try {
    const schema = SchemaBuilder.getSchema(inputSchema)
    const content = isPath ? loadContent(targetObject) : targetObject
    const clone = JSON.parse(JSON.stringify(content))
    const misMatches = new Schema(schema).validate(content).map(err => ({path: err.path, message: err.message}))
    const extraFiels = validateExtraFields(clone, schema)
    return printErrors(misMatches, extraFiels, logger, logLevels[logLevel])
  } catch (error) {
    logger?.error(error)
  }
}

function validateExtraFields(targetObj, schemaObj){
  const extras = []

  const leafNode = (obj) => {
    return obj && ([String, Number, Boolean].includes(obj.type) || typeof obj.required === 'boolean')
  }

  const _parseTarget = (target, schema, parsedLevel = '') => {
    if (typeof target !== 'object'){
      return
    }

    for(const key in target) {
      const schemaKey = target instanceof Array ? schema[0] : schema[key]
      const nextLevel = parsedLevel ? `${parsedLevel}.${key}` : key
      if(!schemaKey || typeof target[key] !== 'object' && !leafNode(schemaKey)) {
        extras.push({ path: nextLevel, message: `${nextLevel} is not present in schema`})
      } else {
        _parseTarget(target[key], schemaKey, nextLevel)
      }
    }
  }

  _parseTarget(targetObj, schemaObj)
  return extras;
}


function _getSchemaFromObj(object){
  const keyValues = {}
  for(const key in object) {
    if(typeof object[key] === 'object') {
      if(Array.isArray(object[key])) {
        const first = object[key][0]
        keyValues[key] = [
          typeof first === 'object' ? _getSchemaFromObj(first) : {type: typeof first}  
        ]
      } else {
        keyValues[key] = _getSchemaFromObj(object[key])
      }
    } else {
      keyValues[key] = { required: true, type: typeof object[key]}
    }
  }

  return keyValues
}
