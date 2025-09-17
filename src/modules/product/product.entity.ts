import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { EEntity } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';

@ObjectType()
@Entity({ tableName: EEntity.PRODUCT })
export class ProductEntity extends BaseEntity {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Field(() => String)
  @Property({ default: '' })
  image: string;

  @Field(() => String)
  @Property({ unique: true, length: 100 })
  name: string;

  @Field(() => String)
  @Property({ length: 1000 })
  description: string;
}
