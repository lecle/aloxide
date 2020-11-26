import { QueryInput } from '@aloxide/demux/src';
import {
  base64,
  unbase64,
  offsetToCursor,
  cursorToOffset,
  convertCursorToOffet,
  forwardPaginationInfo,
  backwardPaginationInfo,
  paginationInfo,
} from '../src/graphql-common-utils';

describe('Graphql Common Ultils', () => {
  const entityName = 'test';

  it('Should convert to base64', () => {
    expect(base64('hello')).toBe('aGVsbG8=');
  });

  it('Should revert to string', () => {
    expect(unbase64('aGVsbG8=')).toBe('hello');
  });

  it('Should parse offset to cursor', () => {
    expect(offsetToCursor(entityName, 1)).toBe('dGVzdDE=');
  });

  it('Should revert cursor to offset', () => {
    expect(cursorToOffset(entityName, 'dGVzdDE=')).toBe(1);
  });

  it('Revert offset Should return NaN', () => {
    expect(cursorToOffset(entityName, 'hello')).toBeNaN();
  });

  it('Should convert cursor to offset', () => {
    const input: QueryInput = {
      first: 2,
      after: 'test',
      last: 2,
      before: 'test',
    };

    const resp = convertCursorToOffet(entityName, input);
    expect(resp.first).toBe(3);
    expect(resp.last).toBe(3);
    expect(resp.after).toBeUndefined();
    expect(resp.before).toBeUndefined();
  });

  it('Should convert cursor to offset', () => {
    const input: QueryInput = {
      first: 2,
      after: 'dGVzdDE=',
      last: 2,
      before: 'dGVzdDE=',
    };

    const resp = convertCursorToOffet(entityName, input);
    expect(resp.first).toBe(3);
    expect(resp.last).toBe(3);
    expect(resp.after).toBe('1');
    expect(resp.before).toBe('1');
  });

  it('Should forward pagination', () => {
    const items = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    const resp = paginationInfo(entityName, items, { first: 2 });

    expect(resp.edges).toBeDefined();
    expect(resp.edges[0].cursor).toBe('dGVzdDE=');
    expect(resp.pageInfo.startCursor).toBe('dGVzdDE=');
    expect(resp.pageInfo.endCursor).toBe('dGVzdDI=');
    expect(resp.pageInfo.hasNextPage).toBe(true);
    expect(resp.pageInfo.hasPreviousPage).toBe(false);
  });

  it('Should backward pagination 2', () => {
    const items = [
      {
        id: 37,
      },
      {
        id: 36,
      },
      {
        id: 35,
      },
    ];

    const resp = paginationInfo(entityName, items, { last: 2 });

    expect(resp.edges).toBeDefined();
    expect(resp.edges[0].cursor).toBe('dGVzdDM2');
    expect(resp.pageInfo.startCursor).toBe('dGVzdDM2');
    expect(resp.pageInfo.endCursor).toBe('dGVzdDM3');
    expect(resp.pageInfo.hasNextPage).toBe(false);
    expect(resp.pageInfo.hasPreviousPage).toBe(true);
  });
});
