import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseColumnsDto {
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;
}
