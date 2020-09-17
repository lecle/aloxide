import path from 'path';
import { createGraphQl } from '../src/graphql-relay';
import { Sequelize } from 'sequelize';

describe('test graphql-relay', () => {
  describe('createGraphql()', () => {
    it('should throw error if missing config', () => {
      // @ts-ignore
      expect(() => {createGraphQl()}).toThrowError('Missing config!');
    });

    it('should throw error if missing aloxideConfigPath', () => {
      expect(() => {
        // @ts-ignore
        createGraphQl({
        });
      }).toThrowError('missing aloxideConfigPath');
    });

    it('should throw error if missing sequelize instance', () => {
      expect(() => {
        // @ts-ignore
        createGraphQl({
          aloxideConfigPath: 'somepath',
        });
      });
    });

    it('should return an array of type and query field', () => {
      const results = createGraphQl({
        aloxideConfigPath: path.resolve(__dirname, './aloxide.yml'),
        sequelize: new Sequelize('database', 'username', 'password', {
          host: 'localhost',
          dialect: 'postgres',
        }),
      });

      expect(Array.isArray(results)).toBe(true);
    });
  });
});
