import { createRouter, CreateRouterConfig } from '../src';
import { AloxideDataManager } from '@aloxide/demux';
import express from 'express';

describe('express-router', () => {
  describe('createRouter()', () => {
    function createProvider(name) {
      const provider = {
        name,
        count: jest.fn(),
        findAll: jest.fn(async () => []),
        find: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      };

      return provider;
    }
    const entity = {
      name: 'Poll',
      fields: [
        {
          name: 'id',
          type: 'number',
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'body',
          type: 'string',
        },
      ],
      key: 'id',
    };

    const config: CreateRouterConfig = {
      aloxideConfig: {
        entities: [entity],
      },
      dataAdapter: new AloxideDataManager({
        dataProviderMap: new Map([['Poll', createProvider('Poll')]]),
      }),
    };

    it('should throw error when missing configs', () => {
      expect(() => {
        // @ts-ignore
        createRouter();
      }).toThrowError('"dataAdapter" and "aloxideConfig" config are required');

      expect(() => {
        // @ts-ignore
        createRouter({ someProp: 'value', aloxideConfig: {} });
      }).toThrowError('"dataAdapter" and "aloxideConfig" config are required');

      expect(() => {
        // @ts-ignore
        createRouter({ dataAdapter: {}, someProp: 'value' });
      }).toThrowError('"dataAdapter" and "aloxideConfig" config are required');
    });

    it('should call logger when available', () => {
      const logger = {
        debug: jest.fn(),
      };
      const res = createRouter({
        ...config,
        logger,
      });

      expect(res).toBeDefined();
      expect(logger.debug).toBeCalledTimes(1);
      expect(logger.debug).toBeCalledWith(expect.any(String), 'Poll');
    });

    it('should create express router', () => {
      const res = createRouter(config);

      expect(res).toBeDefined();
      expect(Object.getPrototypeOf(res)).toBe(express.Router);
    });
  });
});
