import { Logger } from '@aloxide/logger';
import yaml = require('js-yaml')
import fs = require('fs')

export function loadContent(filePath) {
    if (!/json|yml|yaml$/.test(filePath)) {
        throw new Error('Schema file format not supportes. Supported formats : json|yml|yaml')
    }
    const content = fs.readFileSync(filePath)
    return /json$/.test(filePath) ? JSON.parse(content.toString()) : yaml.safeLoad(content)
}

export function printErrors(errors, warnings, logger?: Logger, logLevel = 3) {
    if (errors.length || warnings.length) {
        if (logLevel > 2) {
            logger?.error('====== Schema Validation Error ======')
            logger?.error(`${errors.length} mismatches and ${warnings.length} warnings found.`)
        }
        if (logLevel) {
            errors.forEach((err, index) => logger?.debug(`${index + 1}. ${err.message}`))
        }
        if (logLevel > 1) {
            warnings.forEach((warn, index) => logger?.debug(`${index + 1}. ${warn.message}`))
        }
    } else if (logLevel > 2) {
        logger?.success('Schema Validated Successfully')
    }
    return errors.concat(warnings)
}