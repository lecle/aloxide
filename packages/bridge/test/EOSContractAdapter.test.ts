import path from 'path';

import { EntityConfig, EOSContractAdapter } from '../src';

describe('test EOS contract addapter', () => {
  describe('test generate', () => {
    const entityConfigs: EntityConfig[] = [
      {
        fields: [
          { name: 'id', type: 'uint64_t' },
          { name: 'name', type: 'string' },
          { name: 'body', type: 'string' },
        ],
        key: 'id',
        name: 'Poll',
      },
      {
        fields: [
          { name: 'id', type: 'uint64_t' },
          { name: 'pollId', type: 'uint64_t' },
          { name: 'ownerId', type: 'uint64_t' },
          { name: 'point', type: 'number' },
        ],
        key: 'id',
        name: 'Vote',
      },
    ];

    const outputPath = path.resolve(__dirname, '../out');

    it('should generate smart contract', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        log: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
      };

      adapter.generate(outputPath);
      expect(adapter.logger.debug).toBeCalledWith(`output path is: ${outputPath}`);
    });
  });
});
