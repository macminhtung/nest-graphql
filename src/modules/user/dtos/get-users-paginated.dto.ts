import { GetPaginatedRecordsDto } from '@/common/dtos';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { DEFAULT_ROLES } from '@/common/constants';

@InputType()
export class GetUsersPaginatedDto extends GetPaginatedRecordsDto {
  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsIn([DEFAULT_ROLES.ADMIN.id, DEFAULT_ROLES.STAFF.id, DEFAULT_ROLES.USER.id], { each: true })
  roleIds: number[];
}
