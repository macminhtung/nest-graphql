import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, Index } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { EEntity } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';
import { RoleEntity } from '@/modules/user/role/role.entity';

@ObjectType()
@Entity({ name: EEntity.USER })
export class UserEntity extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
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
  @Column()
  @Index()
  firstName: string;

  @Field(() => String)
  @Column()
  @Index()
  lastName: string;

  @Column({ default: new Date().valueOf().toString() })
  passwordTimestamp: string; // ==> Check JWT after password change

  @Field(() => Boolean)
  @Column({ default: false })
  isEmailVerified: boolean;

  // Relation columns
  @Field(() => Number)
  @Column({ type: 'int2' })
  roleId: number;

  // Relation tables
  @Field(() => RoleEntity, { nullable: true })
  @ManyToOne(() => RoleEntity)
  role: RoleEntity;
}
