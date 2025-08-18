import { Field, ObjectType } from '@nestjs/graphql';
import { BaseColumnsDto } from '@/common/dtos';
import { RoleResponseDto } from '@/modules/user/role/dtos';

@ObjectType()
export class UserResponseDto extends BaseColumnsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  avatar: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Boolean)
  isEmailVerified: boolean;

  @Field(() => Number)
  roleId: number;

  @Field(() => RoleResponseDto, { nullable: true })
  role?: RoleResponseDto;
}
