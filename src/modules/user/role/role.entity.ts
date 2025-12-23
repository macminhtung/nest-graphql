import { Column, PrimaryColumn, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ETableName, ERoleName } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';

@ObjectType()
@Entity({ name: ETableName.ROLE })
export class RoleEntity extends BaseEntity {
  @Field(() => Number)
  @PrimaryColumn({ type: 'int4' })
  id: number;

  @Field(() => String)
  @Column({ type: 'enum', enum: ERoleName })
  name: string;

  @Field(() => String)
  @Column({ nullable: true })
  description: string;
}
