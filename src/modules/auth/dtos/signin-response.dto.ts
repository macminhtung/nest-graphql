import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponseDto {
  @Field(() => String)
  accessToken: string;
}
