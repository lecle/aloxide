import { Connection, ConnectionCursor } from 'graphql-relay';
import type { QueryInput } from '@aloxide/demux';

export interface PageInfoInput {
  entityName: string;
  edges: any[];
  limit: number;
  offset?: string;
}

const NUMER_OF_ITEMS_PER_PAGE = 20;

export type Base64String = string;

export function base64(i: string): Base64String {
  return Buffer.from(i, 'utf8').toString('base64');
}

export function unbase64(i: Base64String): string {
  return Buffer.from(i, 'base64').toString('utf8');
}

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(prefix: string, offset: number): ConnectionCursor {
  return base64(prefix + offset);
}
/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(prefix: string, cursor: ConnectionCursor): number {
  if (cursor) return parseInt(unbase64(cursor).substring(prefix.length), 10);
  return NaN;
}

export function convertCursorToOffet(entityName: string, args: any): QueryInput {
  const updatedArgs: QueryInput = { ...args };

  const beforOffset = cursorToOffset(entityName, updatedArgs.before);
  const afterOffset = cursorToOffset(entityName, updatedArgs.after);

  if (isNaN(beforOffset)) delete updatedArgs.before;
  else updatedArgs.before = beforOffset.toString();

  if (isNaN(afterOffset)) delete updatedArgs.after;
  else updatedArgs.after = afterOffset.toString();

  if (updatedArgs.first) updatedArgs.first += 1;
  if (updatedArgs.last) updatedArgs.last += 1;

  return updatedArgs;
}

export function paginationInfo<T>(
  entityName: string,
  items: any[],
  args: QueryInput,
): Connection<T> {
  if (args.first) {
    return forwardPaginationInfo({
      entityName,
      edges: items,
      limit: args.first,
      offset: args.after,
    });
  }

  if (args.last) {
    return backwardPaginationInfo({
      entityName,
      edges: items,
      limit: args.last,
      offset: args.before,
    });
  }

  return forwardPaginationInfo({ entityName, edges: items, limit: NUMER_OF_ITEMS_PER_PAGE });
}

export function forwardPaginationInfo<T>(pageInput: PageInfoInput): Connection<T> {
  let hasNextPage = false;
  if (pageInput.edges.length > pageInput.limit) {
    pageInput.edges = pageInput.edges.slice(0, pageInput.limit);
    hasNextPage = true;
  }
  const edges = pageInput.edges.map(value => ({
    cursor: offsetToCursor(pageInput.entityName, value.id),
    node: value,
  }));
  return {
    edges,
    pageInfo: {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage,
      hasPreviousPage: pageInput.offset ? true : false,
    },
  };
}

export function backwardPaginationInfo<T>(pageInput: PageInfoInput): Connection<T> {
  let hasPreviousPage = false;
  if (pageInput.edges.length > pageInput.limit) {
    pageInput.edges = pageInput.edges.slice(0, pageInput.limit);
    hasPreviousPage = true;
  }
  const edges = pageInput.edges.reverse().map(value => ({
    cursor: offsetToCursor(pageInput.entityName, value.id),
    node: value,
  }));
  return {
    edges,
    pageInfo: {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage: pageInput.offset ? true : false,
      hasPreviousPage,
    },
  };
}
