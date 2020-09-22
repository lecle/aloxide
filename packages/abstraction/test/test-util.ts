
import {checkName, checkType} from "../src/SchemaValidator";

export const requiredSchema = {
  entities: [{
    name: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
    fields: [{
      name: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
      type: { type: String, required: true, use: { checkType } },
    }],
    key: { type: String, required: true, length: { min: 1, max: 12 }, use: { checkName } },
  }
  ]
}