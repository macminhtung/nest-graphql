import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RefreshTokenDto {
  @Field(() => String)
  @IsString()
  accessToken: string;
}
