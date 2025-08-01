import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePasswordDto {
  @Field(() => String)
  @IsString()
  oldPassword: string;

  @Field(() => String)
  @IsString()
  newPassword: string;
}
