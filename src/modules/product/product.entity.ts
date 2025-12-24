import { Field, ObjectType } from '@nestjs/graphql';
import { Column, PrimaryColumn, Entity } from 'typeorm';
import { ETableName } from '@/common/enums';
import { BaseEntity } from '@/common/base.entity';

@ObjectType()
@Entity({ name: ETableName.PRODUCT })
export class ProductEntity extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ default: '' })
  image: string;

  @Field(() => String)
  @Column({ unique: true, length: 100 })
  name: string;

  @Field(() => String)
  @Column({ length: 1000 })
  description: string;
}
