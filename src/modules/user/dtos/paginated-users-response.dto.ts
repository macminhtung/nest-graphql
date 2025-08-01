import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedResponseDto } from '@/common/dtos';
import { UserEntity } from '@/modules/user/user.entity';

@ObjectType()
export class PaginatedUsersResponseDto extends PaginatedResponseDto<UserEntity> {
  @Field(() => [UserEntity])
  data: UserEntity[];
}
