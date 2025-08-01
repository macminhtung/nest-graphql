import { Field } from '@nestjs/graphql';
import { GetPaginatedRecordsDto } from '@/common/dtos';

export class PaginatedResponseDto<E> {
  constructor(payload: { args: GetPaginatedRecordsDto; total: number; records: E[] }) {
    const { args, total, records } = payload;
    const { page = 1, take = 1 } = args;
    this.page = page;
    this.take = take;
    this.total = total;
    this.records = records;
  }

  @Field(() => Number)
  page: number;

  @Field(() => Number)
  take: number;

  @Field(() => Number)
  total: number;

  records: E[];
}
