import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedResponseDto } from '@/common/dtos';
import { ProductEntity } from '@/modules/product/product.entity';

@ObjectType()
export class PaginatedProductsResponseDto extends PaginatedResponseDto<ProductEntity> {
  @Field(() => [ProductEntity])
  data: ProductEntity[];
}
