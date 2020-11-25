import { Connection, cursorToOffset, offsetToCursor } from 'graphql-relay';
import type { QueryInput } from '@aloxide/demux';

const DEFAULT_ITEM_PER_PAGE = 20;

export function updateCursorToOffet(args: any): QueryInput {
  const updatedArgs: QueryInput = Object.assign({}, args);
  const { after, before } = updatedArgs;

  if (typeof before === 'string' && !isNaN(cursorToOffset(before))) {
    updatedArgs.before = cursorToOffset(before).toString();
  } else delete updatedArgs.before;

  if (typeof after === 'string' && !isNaN(cursorToOffset(after))) {
    updatedArgs.after = cursorToOffset(after).toString();
  } else delete updatedArgs.after;

  if (updatedArgs.first) updatedArgs.first += 1;
  if (updatedArgs.last) updatedArgs.last += 1;

  return updatedArgs;
}

export function paginationInfo<T>(items: any[], args: QueryInput): Connection<T> {
  if (args.first) {
    return forwardPaginationInfo(items, args.first, args.after);
  }

  if (args.last) {
    return backwardPaginationInfo(items, args.last, args.before);
  }

  return forwardPaginationInfo(items, DEFAULT_ITEM_PER_PAGE);
}

export function forwardPaginationInfo<T>(
  edges: any[],
  first: number,
  after: string = null,
): Connection<T> {
  let hasNextPage = false;
  if (edges.length > first) {
    edges = edges.slice(0, first);
    hasNextPage = true;
  }
  edges = edges.map(value => ({
    cursor: offsetToCursor(value.id),
    node: value,
  }));
  return {
    edges,
    pageInfo: {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage,
      hasPreviousPage: after ? true : false,
    },
  };
}

export function backwardPaginationInfo<T>(
  edges: any[],
  last: number,
  before: string = null,
): Connection<T> {
  let hasPreviousPage = false;
  if (edges.length > last) {
    edges = edges.slice(0, last);
    hasPreviousPage = true;
  }
  edges = edges?.reverse()?.map(value => ({
    cursor: offsetToCursor(value.id),
    node: value,
  }));
  return {
    edges,
    pageInfo: {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage: before ? true : false,
      hasPreviousPage,
    },
  };
}
