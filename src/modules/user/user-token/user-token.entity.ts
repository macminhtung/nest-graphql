import { Entity, PrimaryKey, Property, ManyToOne, Index, Enum } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { EEntity, ETokenType } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';
import { UserEntity } from '@/modules/user/user.entity';

@ObjectType()
@Entity({ tableName: EEntity.USER_TOKEN })
@Index({ properties: ['userId', 'type', 'hashToken'] })
export class UserTokenEntity extends BaseEntity {
  @Field()
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Field()
  @Property()
  hashToken: string;

  @Field(() => String)
  @Enum({ type: 'enum', items: () => ETokenType })
  type: ETokenType;

  @Field()
  @Property({ type: 'uuid', nullable: true, unique: true })
  refreshTokenId?: string;

  // ==> [RELATION] COLUMNS <==
  @Field()
  @Property({ type: 'uuid', persist: false })
  userId?: string;

  // ==> [RELATION] TABLES <==
  @ManyToOne(() => UserEntity, { fieldName: 'user_id' })
  user?: UserEntity;
}
