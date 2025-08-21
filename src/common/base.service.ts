import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindOneOptions,
  QueryOrder,
} from '@mikro-orm/postgresql';
import { EntityData, QBFilterQuery } from '@mikro-orm/core';
import { ERROR_MESSAGES } from '@/common/constants';
import { EOrder } from '@/common/enums';
import {
  GetPaginatedRecordsDto,
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_TAKE,
  NUM_LIMIT_RECORDS,
  PaginatedResponseDto,
} from '@/common/dtos';

@Injectable()
export class BaseService<E extends object> {
  constructor(protected readonly repository: EntityRepository<E>) {
    this.entityName = repository.getEntityName();
    this.entityManager = this.repository.getEntityManager();
  }

  public entityName: string;
  public entityManager: EntityManager;

  // #================#
  // # ==> UPDATE <== #
  // #================#
  async update(filter: QBFilterQuery<E>, payload: EntityData<E>) {
    await this.repository.createQueryBuilder().update(payload).where(filter).execute();
  }

  // #=====================#
  // # ==> FIND_RECORD <== #
  // #=====================#
  async findRecord(payload: {
    filter: FilterQuery<E> & { deletedAt?: unknown };
    options?: FindOneOptions<E, Extract<keyof E, string>>;
  }) {
    const { filter, options } = payload;

    // CASE: Filter records with deletedAt IS NOT NULL
    if (!filter.deletedAt) filter.deletedAt = null;

    // Find record
    const existRecord = await this.repository.findOne(filter, options);

    return existRecord;
  }

  // #=====================#
  // # ==> CHECK_EXIST <== #
  // #=====================#
  async checkExist(
    payload: Parameters<typeof this.findRecord>[0] & { errorMessage?: string },
  ): Promise<E> {
    const { filter, options, errorMessage } = payload;

    // Find record
    const existRecord = await this.findRecord({ filter, options });

    // CASE: [NOT_FOUND] Does not existed
    if (!existRecord)
      throw new NotFoundException({
        message: errorMessage || `[${this.entityName}] ${ERROR_MESSAGES.NOT_FOUND}!`,
      });

    return existRecord;
  }

  // #========================#
  // # ==> CHECK_CONFLICT <== #
  // #========================#
  async checkConflict(payload: Parameters<typeof this.findRecord>[0] & { errorMessage?: string }) {
    const { filter, options, errorMessage } = payload;

    // Find record
    const existRecord = await this.findRecord({ filter, options });

    // CASE: [ALREADY_EXISTS] Conflict
    if (existRecord)
      throw new ConflictException({
        message: errorMessage || `[${this.entityName}] ${ERROR_MESSAGES.ALREADY_EXISTS}!`,
      });
  }

  // #=====================#
  // # ==> TRANSACTION <== #
  // #=====================#
  async handleTransactionAndRelease<T>(
    txManage: EntityManager,
    processFunc: (txManage: EntityManager) => Promise<T>,
    rollbackFunc?: () => void,
  ): Promise<T> {
    // Starts new transaction
    await txManage.begin();

    try {
      // Run processFunc
      const resData = await processFunc(txManage);

      // Commit transaction
      await txManage.commit();

      return resData;
    } catch (err) {
      // Transaction rollback
      await txManage.rollback();

      // Rollback func
      if (rollbackFunc) rollbackFunc();
      throw new BadRequestException({ message: err.message });
    }
  }

  // #===============================#
  // # ==> GET PAGINATED RECORDS <== #
  // #===============================#
  async getPaginatedRecords(
    args: GetPaginatedRecordsDto,
    customFilter?: (queryBuilder: ReturnType<EntityRepository<E>['createQueryBuilder']>) => void,
  ): Promise<PaginatedResponseDto<E>> {
    const {
      isDeleted,
      createdFrom,
      createdTo,
      includeIds = [],
      excludeIds = [],
      isSelectAll,
      order = EOrder.DESC,
      page = DEFAULT_PAGE_NUM,
      take = DEFAULT_PAGE_TAKE,
    } = args;

    const baseQB = this.repository.createQueryBuilder(this.entityName);

    baseQB.where({ deletedAt: null });

    // Query records based on includeIds
    if (includeIds.length) baseQB.where({ id: { $in: includeIds } });

    // Query records based on excludeIds
    if (excludeIds.length) baseQB.andWhere({ id: { $nin: excludeIds } });

    // Query records based on createdFrom
    if (createdFrom) baseQB.andWhere({ createdAt: { $gte: createdFrom } });

    // Query records based on createdTo
    if (createdTo) baseQB.andWhere({ createdAt: { $lte: createdTo } });

    // Query deleted records
    if (isDeleted) baseQB.andWhere({ deletedAt: { $ne: null } });
    // Query records are not deleted
    else baseQB.where({ deletedAt: null });

    // Custom filter
    if (customFilter) customFilter(baseQB);

    // Sort records via createdAt
    baseQB.orderBy({ createdAt: order === EOrder.DESC ? QueryOrder.DESC : QueryOrder.ASC });

    if (isSelectAll) baseQB.limit(NUM_LIMIT_RECORDS);
    else baseQB.limit(take).offset((page - 1) * take);

    const [records, count] = await baseQB.getResultAndCount();
    return new PaginatedResponseDto<E>({ args, total: count, records });
  }
}
