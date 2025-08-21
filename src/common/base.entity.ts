import { Field, ObjectType } from '@nestjs/graphql';
import { Property } from '@mikro-orm/core';

@ObjectType()
export abstract class BaseEntity {
  @Field(() => Date)
  @Property({ type: 'timestamptz', default: new Date().toDateString(), onCreate: () => new Date() })
  createdAt?: Date;

  @Field(() => Date)
  @Property({
    type: 'timestamptz',
    nullable: true,
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Property({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
