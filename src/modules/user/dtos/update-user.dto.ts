import { IsString, IsIn } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { DEFAULT_ROLES } from '@/common/constants';

@InputType()
export class UpdateUserDto {
  @Field(() => String)
  @IsString()
  avatar: string;

  @Field(() => String)
  @IsString()
  firstName: string;

  @Field(() => String)
  @IsString()
  lastName: string;

  @Field(() => Number)
  @IsIn([DEFAULT_ROLES.ADMIN.id, DEFAULT_ROLES.STAFF.id, DEFAULT_ROLES.USER.id])
  roleId: number;
}
