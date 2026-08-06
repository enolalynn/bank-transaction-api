/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export interface BasePaginationArgs {
  limit: number;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

export interface OffsetPaginationArgs extends BasePaginationArgs {
  mode?: 'offset';
  page: number;
  includePageCount?: boolean;
}

export interface CursorPaginationArgs extends BasePaginationArgs {
  mode: 'cursor';
  cursor?: Record<string, any>;
  cursorKey?: string;
}

export type PaginateOptions = OffsetPaginationArgs | CursorPaginationArgs;

export interface OffsetPaginationMeta {
  type: 'offset';
  currentPage: number;
  limit: number;
  total?: number;
  pageCount?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CursorPaginationMeta {
  type: 'cursor';
  limit: number;
  nextCursor: any | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginateResult<
  T,
  TMode extends 'offset' | 'cursor' = 'offset',
> {
  data: T[];
  meta: TMode extends 'cursor' ? CursorPaginationMeta : OffsetPaginationMeta;
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();

    // Returning the extended instance binds all $allModels pagination
    return this.$extends({
      model: {
        $allModels: {
          async paginate<T, TArgs extends PaginateOptions>(
            this: T,
            args: TArgs,
          ): Promise<
            PaginateResult<
              Prisma.Result<T, any, 'findMany'>[number],
              TArgs extends CursorPaginationArgs ? 'cursor' : 'offset'
            >
          > {
            const ctx = Prisma.getExtensionContext(this);
            const { limit, where, orderBy, include, select } = args;

            // CURSOR-BASED PAGINATION
            if (args.mode === 'cursor') {
              const { cursor, cursorKey = 'id' } = args;
              const take = limit + 1;
              const cursorObj = cursor ? { cursor } : {};
              const skip = cursor ? 1 : 0;

              const data = await (ctx as any).findMany({
                take,
                skip,
                ...cursorObj,
                where,
                orderBy,
                include,
                select,
              });

              const hasNextPage = data.length > limit;
              if (hasNextPage) {
                data.pop();
              }

              const lastItem = data[data.length - 1];
              const nextCursor =
                hasNextPage && lastItem ? (lastItem[cursorKey] ?? null) : null;

              return {
                data,
                meta: {
                  type: 'cursor',
                  limit,
                  nextCursor,
                  hasNextPage,
                  hasPreviousPage: !!cursor,
                },
              } as any;
            }

            // OFFSET-BASED PAGINATION
            const { page = 1, includePageCount = true } = args;
            const take = limit;
            const skip = (page - 1) * limit;

            const [data, totalCount] = await Promise.all([
              (ctx as any).findMany({
                skip,
                take,
                where,
                orderBy,
                include,
                select,
              }),
              includePageCount ? (ctx as any).count({ where }) : undefined,
            ]);

            const total = totalCount ?? 0;
            const pageCount = includePageCount ? Math.ceil(total / limit) : 0;

            return {
              data,
              meta: {
                type: 'offset',
                currentPage: page,
                limit,
                total: includePageCount ? total : undefined,
                pageCount: includePageCount ? pageCount : undefined,
                hasNextPage: includePageCount
                  ? page < pageCount
                  : data.length === limit,
                hasPreviousPage: page > 1,
              },
            } as any;
          },
        },
      },
    }) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
