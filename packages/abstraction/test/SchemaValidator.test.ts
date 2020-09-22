import path from 'path';
import { readAloxideConfig } from "../src";
import { requiredSchema } from './test-util';
import * as SchemaValidator from "../src/SchemaValidator";
describe('test SchemaValidator', () => {

  const aloxideConfig = readAloxideConfig(path.resolve(__dirname, './aloxide.yml'));
  const logger = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  };
  describe('test function validateSchema', () => {
    it('should validateSchema successful', () => {
      const schemaErrors = SchemaValidator.validateSchema(aloxideConfig, requiredSchema, logger);
      expect(schemaErrors.length).toBeLessThan(1);
    });

    it('should validateSchema failed', () => {
      const schemaErrors = SchemaValidator.validateSchema(aloxideConfig, null, logger);
      expect(schemaErrors.length >= 1).toBeTruthy();
    });

    it('should validateSchema but occurs exception cause the first param is null', () => {
      const schemaErrors = SchemaValidator.validateSchema(null, requiredSchema, logger)
      expect(schemaErrors).toBeUndefined();
    });
    it('should validateSchema but occurs exception cause the first param is null', () => {
      const schemaErrors = SchemaValidator.validateSchema('', requiredSchema, logger)
      expect(schemaErrors).toBeUndefined();
    });

  });
  describe('test validateEntity function', () => {
    it('test validate entity successfully', async () => {
      const validateSchemaMock = jest.spyOn(SchemaValidator, 'validateSchema').mockReturnValueOnce([]);
      const result = SchemaValidator.validateEntity(aloxideConfig);
      expect(result).toBeTruthy();
      expect(validateSchemaMock).toHaveBeenCalledTimes(1);
      expect(validateSchemaMock.mock.calls[0][0]).toBe(aloxideConfig);
      expect(validateSchemaMock.mock.calls[0][1].toString()).toEqual(requiredSchema.toString());

    });

    it('test validate entity failed', async () => {
      const validateSchemaMock = jest.spyOn(SchemaValidator, 'validateSchema').mockReturnValueOnce([{}, {}]);
      const result = SchemaValidator.validateEntity(aloxideConfig);
      expect(result).toBeFalsy();
      expect(validateSchemaMock).toHaveBeenCalledTimes(1);
      expect(validateSchemaMock.mock.calls[0][0]).toBe(aloxideConfig);
      expect(validateSchemaMock.mock.calls[0][1].toString()).toEqual(requiredSchema.toString());

    });
  });

});