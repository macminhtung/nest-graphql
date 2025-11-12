import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RefreshAccessTokenDto {
  @Field(() => String)
  @IsString()
  accessToken: string;
}
