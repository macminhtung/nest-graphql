import {
  ConflictException,
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  GetPaginatedRecordsDto,
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_TAKE,
  NUM_LIMIT_RECORDS,
  PaginatedResponseDto,
} from '@/common/dtos';
import { ERROR_MESSAGES } from '@/common/constants';
import { EOrder } from '@/common/enums';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_INJECT_TOKEN, SCHEMA } from '@/modules/database/database.module';
import {
  inArray,
  notInArray,
  gte,
  lte,
  isNotNull,
  asc,
  desc,
  count,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
import { AnyPgSelectQueryBuilder, PgSelectDynamic } from 'drizzle-orm/pg-core';

type TSchema = typeof SCHEMA;
type QueryType = NodePgDatabase<TSchema>['query'];
type TFindFirstConfig<T extends TTableName> = Parameters<QueryType[T]['findFirst']>[0];
type TTableName = keyof QueryType;
type TTableSchema<T extends TTableName> = TSchema[T];
type TTableRecord<T extends TTableName> = TTableSchema<T>['$inferSelect'];
type TWithRelation<T extends TTableName> = ExtractTablesWithRelations<TSchema[T]['$inferSelect']>;

@Injectable()
export class BaseService<T extends TTableName> {
  constructor(protected readonly tableName: T) {}

  @Inject(DATABASE_INJECT_TOKEN)
  public readonly database: NodePgDatabase<TSchema>;

  // #==============================#
  // # ==> GET SELECTION FIELDS <== #
  // #==============================#
  getSelectionFields(tableName: T) {
    const cols = Object.keys(SCHEMA[tableName]['_']['columns']);
    return cols.reduce((preV, curV) => ({ ...preV, [curV]: SCHEMA[tableName][curV] }), {});
  }

  // #=============================#
  // # ==> GET PAGINATED QUERY <== #
  // #=============================#
  getPaginatedQueries() {
    const tableName: TTableName = this.tableName;
    return {
      paginatedQuery: this.database.select().from(SCHEMA[tableName]).$dynamic(),
      countQuery: this.database.select({ count: count() }).from(SCHEMA[tableName]).$dynamic(),
    };
  }

  // #=====================#
  // # ==> CHECK_EXIST <== #
  // #=====================#
  async checkExist<K extends TFindFirstConfig<T> & TWithRelation<T>>(payload: {
    tableName?: T;
    findOpts: K;
    errorMessage?: string;
  }) {
    const { tableName = this.tableName, findOpts, errorMessage } = payload;
    const existRecord = await this.database.query[tableName].findFirst({
      ...findOpts,
      with: { ...findOpts?.with },
    });

    // Throw error if the record doesn't exists
    if (!existRecord)
      throw new NotFoundException({
        message: errorMessage || `[${tableName}] ${ERROR_MESSAGES.NOT_FOUND}!`,
      });

    return existRecord;
  }

  // #========================#
  // # ==> CHECK_CONFLICT <== #
  // #========================#
  async checkConflict(payload: {
    tableName?: T;
    findOpts: TFindFirstConfig<T>;
    errorMessage?: string;
  }) {
    const { tableName = this.tableName, findOpts, errorMessage } = payload;
    const existRecord = await this.database.query[tableName].findFirst(findOpts);

    // Throw error if the record exists
    if (existRecord)
      throw new ConflictException({
        message: errorMessage || `[${tableName}] ${ERROR_MESSAGES.ALREADY_EXISTS}!`,
      });
  }

  // #=====================#
  // # ==> TRANSACTION <== #
  // #=====================#
  async handleTransactionAndRelease<T>(
    processFunc: (tx: NodePgDatabase<TSchema>) => Promise<T>,
    rollbackFunc?: () => void,
  ) {
    try {
      // Process function
      return await this.database.transaction((tx) => processFunc(tx));
    } catch (error) {
      // Rollback func
      if (rollbackFunc) rollbackFunc();

      // Throw transaction error message
      throw new BadRequestException({ message: error.message });
    }
  }

  // #===============================#
  // # ==> GET PAGINATED RECORDS <== #
  // #===============================#
  async getPaginatedRecords(
    args: GetPaginatedRecordsDto,
    customFilter?: (query: ReturnType<typeof this.getPaginatedQueries>['paginatedQuery']) => void,
  ): Promise<PaginatedResponseDto<TTableRecord<T>>> {
    const {
      isDeleted,
      createdFrom,
      createdTo,
      includeIds,
      excludeIds,
      isSelectAll,
      order = EOrder.DESC,
      page = DEFAULT_PAGE_NUM,
      take = DEFAULT_PAGE_TAKE,
    } = args;

    const tableSchema = SCHEMA[this.tableName];

    // Create database selector
    const { paginatedQuery, countQuery } = this.getPaginatedQueries();
    const baseQueries = [paginatedQuery, countQuery];

    // Query records based on includeIds
    if (includeIds?.length)
      baseQueries.forEach((q) => q.where(inArray(tableSchema.id, includeIds)));

    // Query records based on excludeIds
    if (excludeIds?.length)
      baseQueries.forEach((q) => q.where(notInArray(tableSchema.id, excludeIds)));

    // Query records based on createdFrom
    if (createdFrom)
      baseQueries.forEach((q) => q.where(gte(tableSchema.createdAt, new Date(createdFrom))));

    // Query records based on createdTo
    if (createdTo)
      baseQueries.forEach((q) => q.where(lte(tableSchema.createdAt, new Date(createdTo))));

    // Query deleted records
    if (isDeleted) baseQueries.forEach((q) => q.where(isNotNull(tableSchema.deletedAt)));

    // Run customFilter function
    if (customFilter)
      baseQueries.forEach((query: PgSelectDynamic<AnyPgSelectQueryBuilder>) => customFilter(query));

    // Sort records based on createdAt
    paginatedQuery.orderBy(
      order === EOrder.ASC ? asc(tableSchema.createdAt) : desc(tableSchema.createdAt),
    );

    // CASE: Select all records
    if (isSelectAll) baseQueries.forEach((q) => q.limit(NUM_LIMIT_RECORDS));
    // CASE: Select pagination records
    else baseQueries.forEach((q) => q.limit(take).offset((page - 1) * take));

    const [records, count] = await Promise.all([
      paginatedQuery,
      isSelectAll ? 1 : (await countQuery)[0].count,
    ]);
    const total = isSelectAll ? records.length : count;
    return new PaginatedResponseDto<TTableRecord<T>>({ args, total, records });
  }
}
