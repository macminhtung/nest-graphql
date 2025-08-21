import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { EEntity, ERoleName } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';

@ObjectType()
@Entity({ tableName: EEntity.ROLE })
export class RoleEntity extends BaseEntity {
  @Field(() => Number)
  @PrimaryKey({ type: 'int4' })
  id: number;

  @Field(() => String)
  @Enum({ type: 'enum', items: () => ERoleName })
  name: ERoleName;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description: string;
}
