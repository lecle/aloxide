import { loadContent } from './utils'

const TYPE_MAPPER = {
    'string': String,
    'number': Number,
    'boolean': Boolean,
}
export default class SchemaBuilder {
    
    static getSchema(schema) {
        const schemaJson = typeof schema === 'string' ? loadContent(schema) : schema
        return SchemaBuilder._convertToJS(schemaJson)
    }

    private static _convertToJS(object) {
        let result = object instanceof Array ? [] : {}
        for (let key in object) {
            const isObject = typeof object[key] === 'object'
            result[key] = isObject ? SchemaBuilder._convertToJS(object[key]) : (TYPE_MAPPER[object[key]] || object[key])
        }
        return result;
    }
};

