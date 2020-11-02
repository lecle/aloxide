import { createGraphQl, CreateGraphQlConfig } from '../src';
import { AloxideDataManager } from '@aloxide/demux';

describe('graphql-relay', () => {
  describe('createGraphQl()', () => {
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

    const config: CreateGraphQlConfig = {
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
        createGraphQl();
      }).toThrowError('"dataAdapter" and "aloxideConfig" config are required');

      expect(() => {
        // @ts-ignore
        createGraphQl({ someProp: 'value', aloxideConfig: {} });
      }).toThrowError('"dataAdapter" and "aloxideConfig" config are required');

      expect(() => {
        // @ts-ignore
        createGraphQl({ dataAdapter: {}, someProp: 'value' });
      }).toThrowError('"dataAdapter" and "aloxideConfig" config are required');
    });

    it('should call logger when available', () => {
      const logger = {
        debug: jest.fn(),
      };
      const res = createGraphQl({
        ...config,
        logger,
      });

      expect(res).toBeDefined();
      expect(logger.debug).toBeCalledTimes(1);
      expect(logger.debug).toBeCalledWith(expect.any(String), 'Poll');
    });

    it('should create graphql output', async () => {
      const res = createGraphQl(config);

      expect(res.length).toBe(1);
      expect(res[0]).toEqual(
        expect.objectContaining({
          graphQLObjectType: expect.any(Object),
          connectionQueryField: expect.any(Object),
        }),
      );
    });

    test('graphql resolver should find all item available', async () => {
      const graphqlOutputs = createGraphQl(config);

      expect(graphqlOutputs.length).toBe(1);
      expect(graphqlOutputs[0]).toBeDefined();
      expect(graphqlOutputs[0].connectionQueryField).toBeDefined();
      expect(graphqlOutputs[0].connectionQueryField.resolve).toEqual(expect.any(Function));

      const resolver = graphqlOutputs[0].connectionQueryField.resolve;
      // @ts-ignore
      const ret = resolver({}, { test: 'test' });

      expect(ret).toEqual(expect.any(Promise));
      expect(config.dataAdapter.dataProviderMap.get('Poll').findAll).toBeCalledWith(
        { test: 'test' },
        { entity: config.aloxideConfig.entities[0] },
      );

      const res = await ret;
      expect(res).toBeDefined();
    });
  });
});
