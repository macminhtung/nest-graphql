import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  OneToMany,
  Cascade,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { EEntity } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';
import { RoleEntity } from '@/modules/user/role/role.entity';
import { UserTokenEntity } from '@/modules/user/user-token/user-token.entity';

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

  @Field(() => Boolean)
  @Property({ default: false })
  isEmailVerified: boolean;

  // ==> [RELATION] COLUMNS <==
  @Field(() => Number)
  @Property({ type: 'int4', persist: false })
  roleId?: number;

  // ==> [RELATION] TABLES <==
  @Field(() => RoleEntity, { nullable: true })
  @ManyToOne(() => RoleEntity, { fieldName: 'role_id' })
  role?: RoleEntity;

  @OneToMany(() => UserTokenEntity, (e) => e.user, { cascade: [Cascade.ALL] })
  tokenManagements?: UserTokenEntity[];
}
