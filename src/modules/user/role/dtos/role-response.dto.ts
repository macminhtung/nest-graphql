import { Field, ObjectType } from '@nestjs/graphql';
import { ERoleName } from '@/common/enums';
import { BaseColumnsDto } from '@/common/dtos';

@ObjectType()
export class RoleResponseDto extends BaseColumnsDto {
  @Field(() => Number)
  id: number;

  @Field(() => ERoleName)
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;
}
