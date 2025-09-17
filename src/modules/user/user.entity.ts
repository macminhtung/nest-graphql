import { Entity, PrimaryKey, Property, ManyToOne, Index } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { EEntity } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';
import { RoleEntity } from '@/modules/user/role/role.entity';

@ObjectType()
@Entity({ tableName: EEntity.USER })
export class UserEntity extends BaseEntity {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Field(() => String)
  @Property({ default: '' })
  avatar?: string;

  @Field(() => String)
  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Field(() => String)
  @Index()
  @Property()
  firstName: string;

  @Field(() => String)
  @Index()
  @Property()
  lastName: string;

  @Property({ default: new Date().valueOf().toString() })
  passwordTimestamp: string; // Check JWT after password change

  @Field(() => Boolean)
  @Property({ default: false })
  isEmailVerified: boolean;

  @Field(() => Number)
  @Property({ type: 'int4', persist: false })
  roleId: number;

  @Field(() => RoleEntity, { nullable: true })
  @ManyToOne(() => RoleEntity)
  role?: RoleEntity;
}
