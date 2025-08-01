import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { EEntity, ERoleName } from '@/common/enums';
import { Roles } from '@/decorators';
import { Public } from '@/decorators';
import { ProductService } from '@/modules/product/product.service';
import { ProductEntity } from '@/modules/product/product.entity';
import { CreateProductDto, PaginatedProductsResponseDto } from '@/modules/product/dtos';
import { GetPaginatedRecordsDto, PaginatedResponseDto } from '@/common/dtos';

@Resolver(EEntity.PRODUCT)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // #========================#
  // # ==> CREATE PRODUCT <== #
  // #========================#
  @Roles([ERoleName.ADMIN])
  @Mutation(() => ProductEntity)
  createProduct(@Args('payload') payload: CreateProductDto): Promise<ProductEntity> {
    return this.productService.createProduct(payload);
  }

  // #========================#
  // # ==> UPDATE PRODUCT <== #
  // #========================#
  @Roles([ERoleName.ADMIN])
  @Mutation(() => ProductEntity)
  updateProduct(
    @Args('id') id: string,
    @Args('payload') payload: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(id, payload);
  }

  // #========================#
  // # ==> DELETE PRODUCT <== #
  // #========================#
  @Roles([ERoleName.ADMIN])
  @Mutation(() => String)
  deleteProduct(@Args('id') id: string): Promise<string> {
    return this.productService.deleteProduct(id);
  }

  // #================================#
  // # ==> GET PAGINATED PRODUCTS <== #
  // #================================#
  @Public()
  @Query(() => PaginatedProductsResponseDto)
  getPaginatedProducts(
    @Args('queryParams') queryParams: GetPaginatedRecordsDto,
  ): Promise<PaginatedResponseDto<ProductEntity>> {
    return this.productService.getPaginatedProducts(queryParams);
  }
}
