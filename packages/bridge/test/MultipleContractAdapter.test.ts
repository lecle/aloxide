import { createLogger } from '@aloxide/logger';

import { EOSContractAdapter, ICONContractAdapter, MultipleContractAdapter } from '../src';

describe('test MultiplecontractAdapter', () => {
  it('should call each adapter generate', () => {
    const adapter1 = new EOSContractAdapter();
    adapter1.generate = jest.fn();

    const adapter2 = new ICONContractAdapter();
    adapter2.generate = jest.fn();

    const adapter = new MultipleContractAdapter();
    adapter.addAdapters(adapter1, adapter2);
    adapter.entityConfigs = [];
    adapter.logger = createLogger();

    const outputPath = __dirname;
    adapter.generate(outputPath);

    Object.keys(adapter)
      .filter(k => typeof adapter[k] !== 'function' && k !== 'adapters')
      .forEach(k => {
        expect(adapter1[k]).toEqual(adapter[k]);
        expect(adapter2[k]).toEqual(adapter[k]);
      });

    expect(adapter1.generate).toBeCalledWith(outputPath);
    expect(adapter2.generate).toBeCalledWith(outputPath);
  });
});
