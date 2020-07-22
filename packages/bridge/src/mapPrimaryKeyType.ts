import mapType from './mapType';

export default function (fields: { name: string; type: string }[], name: string): string {
  const primaryKeyField = fields.find(item => item.name === name);

  if (!primaryKeyField) {
    throw new Error(`missing primary key field: [${name}]`);
  }

  return mapType(primaryKeyField.type);
}
