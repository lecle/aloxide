import { loadContent } from './Utils';

const TYPE_MAPPER = {
  string: String,
  number: Number,
  boolean: Boolean,
};
export default class SchemaBuilder {
  static getSchema(schema) {
    const schemaJson = typeof schema === 'string' ? loadContent(schema) : schema;
    return SchemaBuilder._convertToJS(schemaJson);
  }

  private static _convertToJS(obj) {
    const result = obj instanceof Array ? [] : {};
    for (const key in obj) {
      const isObject = typeof obj[key] === 'object';
      result[key] = isObject
        ? SchemaBuilder._convertToJS(obj[key])
        : TYPE_MAPPER[obj[key]] || obj[key];
    }
    return result;
  }
}
