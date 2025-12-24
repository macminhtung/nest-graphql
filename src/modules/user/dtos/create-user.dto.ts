import { IsEmail, IsString, IsIn, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { DEFAULT_ROLES } from '@/common/constants';

@InputType()
export class CreateUserDto {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MaxLength(100)
  firstName: string;

  @Field(() => String)
  @IsString()
  @MaxLength(100)
  lastName: string;

  @Field(() => Number)
  @IsIn([DEFAULT_ROLES.ADMIN.id, DEFAULT_ROLES.STAFF.id, DEFAULT_ROLES.USER.id])
  roleId: number;
}
