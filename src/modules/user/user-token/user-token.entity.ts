import { Column, PrimaryColumn, Entity, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ETableName, ETokenType } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';
import { UserEntity } from '@/modules/user/user.entity';

@ObjectType()
@Entity({ name: ETableName.USER_TOKEN })
@Index(['userId', 'type', 'hashToken'])
export class UserTokenEntity extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  hashToken: string;

  @Field(() => ETokenType)
  @Column({ type: 'enum', enum: ETokenType })
  type: ETokenType;

  @Field(() => String)
  @Column({ type: 'uuid', nullable: true, unique: true })
  refreshTokenId?: string;

  // ==> [RELATION] COLUMNS <==
  @Field(() => String)
  @Column({ type: 'uuid' })
  userId: string;

  // ==> [RELATION] TABLES <==
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
