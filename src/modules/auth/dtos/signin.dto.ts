import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class SignInDto {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;
}
