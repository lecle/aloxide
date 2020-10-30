import {
  RetrieveBlockError,
  RetrieveHeadBlockError,
  RetrieveIrreversibleBlockError,
  NoBlockStateFoundError,
  MultipleBlockStateError,
} from '../src/errors';

describe('errors', () => {
  it('RetrieveBlockError', () => {
    expect(() => {
      throw new RetrieveBlockError();
    }).toThrowError('Error block, max retries failed');
  });

  it('RetrieveHeadBlockError', () => {
    expect(() => {
      throw new RetrieveHeadBlockError();
    }).toThrowError('Error retrieving head block, max retries failed');
  });

  it('RetrieveIrreversibleBlockError', () => {
    expect(() => {
      throw new RetrieveIrreversibleBlockError();
    }).toThrowError('Error retrieving last irreversible block, max retries failed');
  });

  it('NoBlockStateFoundError', () => {
    const blockNumber = 139889;
    expect(() => {
      throw new NoBlockStateFoundError(blockNumber);
    }).toThrowError(`No block state with block number ${blockNumber} found`);
  });

  it('MultipleBlockStateError', () => {
    const blockNumber = 1403030;
    expect(() => {
      throw new MultipleBlockStateError(blockNumber);
    }).toThrowError(
      `More than one block state returned for block number ${blockNumber}. ` +
        'Make sure you have the `--mongodb-update-via-block-num` flag set on your node.',
    );
  });
});
