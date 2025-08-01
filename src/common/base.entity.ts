import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class BaseEntity {
  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deletedAt: Date;
}
