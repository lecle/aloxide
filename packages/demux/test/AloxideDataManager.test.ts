import { AloxideDataManager } from '../src';
import { AloxideDataManagerOptions } from '../src/AloxideDataManager';

describe('test AloxideDataManager', () => {
  describe('contructor', () => {
    it('create new instance', () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const aloxideDataManager = new AloxideDataManager(options);
      expect(aloxideDataManager).toBeTruthy();
      expect(aloxideDataManager.dataProviderMap).toEqual(options.dataProviderMap);
    });

    it('throw error if dataProviderMap is not provided', () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: null,
      };
      expect(() => new AloxideDataManager(options)).toThrow(`Missing data provider map!`);
    });
  });

  describe('call verify', () => {
    it('throw error if missing data provider', () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const entityNames = ['s1', 's2'];
      const adm = new AloxideDataManager(options);
      expect(() => adm.verify(entityNames)).toThrow(
        `Missing data provider name: ${entityNames.join(', ')}`,
      );
    });

    it('not throw error if there are data providers', () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const entityNames = ['s1', 's2'];
      entityNames.forEach(n => {
        // @ts-ignore
        options.dataProviderMap.set(n, {});
      });

      const adm = new AloxideDataManager(options);
      expect(() => adm.verify(entityNames)).not.toThrow(
        `Missing data provider name: ${entityNames.join(', ')}`,
      );
    });
  });

  describe('call setup', () => {
    it('provider setup is a function', async () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const entityNames = ['s1', 's2'];
      const provider = {
        setup: () => Promise.resolve(),
      };
      const setup = jest.spyOn(provider, 'setup');

      entityNames.forEach(n => {
        // @ts-ignore
        options.dataProviderMap.set(n, provider);
      });

      const adm = new AloxideDataManager(options);
      await expect(adm.setup(entityNames[0])).resolves.toBeUndefined();

      expect(setup).toBeCalledTimes(1);
    });

    it('provider setup is not a function', async () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const entityNames = ['s1', 's2'];
      const setup = {};
      entityNames.forEach(n => {
        // @ts-ignore
        options.dataProviderMap.set(n, {
          // @ts-ignore
          setup,
        });
      });

      const adm = new AloxideDataManager(options);
      await expect(adm.setup(entityNames[0])).resolves.toBeUndefined();
    });
  });

  describe('test common functions', () => {
    const options: AloxideDataManagerOptions = {
      dataProviderMap: new Map(),
    };
    const entityNames = ['s1'];
    const provider = {
      name: entityNames[0],
      count: jest.fn().mockResolvedValue(5),
      findAll: jest.fn().mockResolvedValue([1, 2]),
      find: jest.fn().mockResolvedValue({ find: 'ee' }),
      create: jest.fn().mockResolvedValue({ create: 'ee' }),
      update: jest.fn().mockResolvedValue({ update: 'ee' }),
      delete: jest.fn().mockResolvedValue(true),
    };

    options.dataProviderMap.set(provider.name, provider);

    it('call count', async () => {
      const adm = new AloxideDataManager(options);
      await expect(adm.count(entityNames[0])).resolves.toEqual(5);
      expect(provider.count).toBeCalledTimes(1);
    });

    it('call findAll', async () => {
      const adm = new AloxideDataManager(options);
      const queryInput = {
        limit: 5,
      };
      const meta = {
        entity: {},
      };

      // @ts-ignore
      await expect(adm.findAll(entityNames[0], queryInput, meta)).resolves.toEqual([1, 2]);
      expect(provider.findAll).toBeCalledTimes(1);
      expect(provider.findAll).toBeCalledWith(queryInput, meta);
    });

    it('call find', async () => {
      const adm = new AloxideDataManager(options);
      const id = 'xxzz';
      const meta = {
        entity: {},
      };

      // @ts-ignore
      await expect(adm.find(entityNames[0], id, meta)).resolves.toEqual({ find: 'ee' });
      expect(provider.find).toBeCalledTimes(1);
      expect(provider.find).toBeCalledWith(id, meta);
    });

    it('call create', async () => {
      const adm = new AloxideDataManager(options);
      const data = { id: 5, body: 'xxzz' };
      const meta = {
        entity: {},
      };

      // @ts-ignore
      await expect(adm.create(entityNames[0], data, meta)).resolves.toEqual({ create: 'ee' });
      expect(provider.create).toBeCalledTimes(1);
      expect(provider.create).toBeCalledWith(data, meta);
    });

    it('call update', async () => {
      const adm = new AloxideDataManager(options);
      const data = { id: 5, body: 'xxzz' };
      const meta = {
        entity: {},
      };

      // @ts-ignore
      await expect(adm.update(entityNames[0], data, meta)).resolves.toEqual({ update: 'ee' });
      expect(provider.update).toBeCalledTimes(1);
      expect(provider.update).toBeCalledWith(data, meta);
    });

    it('call delete', async () => {
      const adm = new AloxideDataManager(options);
      const id = '{idxxzz}';
      const meta = {
        entity: {},
      };

      // @ts-ignore
      await expect(adm.delete(entityNames[0], id, meta)).resolves.toEqual(true);
      expect(provider.delete).toBeCalledTimes(1);
      expect(provider.delete).toBeCalledWith(id, meta);
    });
  });

  describe('call getDataProvider', () => {
    it('throw error on missing data provider', () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const entityNames = ['s1', 's2'];

      // @ts-ignore
      options.dataProviderMap.set(entityNames[0], { setup: jest.fn() });

      const adm = new AloxideDataManager(options);
      expect(() => adm.getDataProvider(entityNames[1])).toThrow(
        'Missing data provider name: ' + entityNames[1],
      );
    });

    it('return data provider', () => {
      const options: AloxideDataManagerOptions = {
        dataProviderMap: new Map(),
      };
      const entityNames = ['s1', 's2'];
      const provider = { setup: () => {} };

      // @ts-ignore
      options.dataProviderMap.set(entityNames[0], provider);

      const adm = new AloxideDataManager(options);
      expect(adm.getDataProvider(entityNames[0])).toEqual(provider);
    });
  });
});
