import { Column, PrimaryColumn, Entity, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ETableName } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';
import { RoleEntity } from '@/modules/user/role/role.entity';

@ObjectType()
@Entity({ name: ETableName.USER })
export class UserEntity extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ default: '' })
  avatar: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => String)
  @Column({ length: 100 })
  @Index()
  firstName: string;

  @Field(() => String)
  @Column({ length: 100 })
  @Index()
  lastName: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isEmailVerified: boolean;

  // Relation columns
  @Field(() => Number)
  @Column({ type: 'int4' })
  roleId: number;

  // Relation tables
  @Field(() => RoleEntity, { nullable: true })
  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
