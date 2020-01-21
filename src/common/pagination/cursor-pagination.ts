import { SelectQueryBuilder } from 'typeorm';

export interface IPagination {
  current: number;
  pageSize: number;
  offset: number;
}

export class CursorPagination {
  public static parseCursor<T extends IPagination>(cursor: string): T {
    const buff = Buffer.from(cursor, 'base64');
    const cursorStr = buff.toString('utf-8');
    return JSON.parse(cursorStr);
  }

  public static generateCursor(obj: any): string {
    const s = JSON.stringify(obj);
    const buff = Buffer.from(s);
    return buff.toString('base64');
  }

  public static async cursorList<T>(
    queryBuilder: SelectQueryBuilder<T>,
    first: number,
    after?: string,
  ) {
    if (first < 0) {
      throw new Error('first must be positive');
    }
    const pagination = after
      ? CursorPagination.parseCursor(after)
      : { offset: -1 };
    const offset = pagination.offset + 1;
    const [list, totalCount] = await queryBuilder
      .skip(offset)
      .take(first)
      .getManyAndCount();
    const hasNextPage = list.length < totalCount - offset ? true : false;
    let endCursor = '';
    const edges = list.map((userWord, index) => {
      endCursor = CursorPagination.generateCursor({
        ...pagination,
        offset: offset + index,
      });
      return {
        cursor: endCursor,
        node: userWord,
      };
    });
    const pageInfo = endCursor
      ? {
          endCursor,
          hasNextPage,
        }
      : {
          hasNextPage,
        };
    const result = {
      edges,
      pageInfo,
      totalCount,
    };
    return result;
  }
}
