import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { ETableName } from '@/common/enums';
import { DEFAULT_ROLES } from '@/common/constants';
import { Public, Roles } from '@/decorators';
import { GetPaginatedRecordsDto, PaginatedResponseDto } from '@/common/dtos';
import { ProductService } from '@/modules/product/product.service';
import { ProductEntity } from '@/modules/product/product.entity';
import { CreateProductDto, PaginatedProductsResponseDto } from '@/modules/product/dtos';

@Resolver(ETableName.PRODUCT)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // #========================#
  // # ==> CREATE PRODUCT <== #
  // #========================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Mutation(() => ProductEntity)
  createProduct(@Args('payload') payload: CreateProductDto): Promise<ProductEntity> {
    return this.productService.createProduct(payload);
  }

  // #========================#
  // # ==> UPDATE PRODUCT <== #
  // #========================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Mutation(() => ProductEntity)
  updateProduct(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('payload') payload: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(id, payload);
  }

  // #========================#
  // # ==> DELETE PRODUCT <== #
  // #========================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Mutation(() => String)
  deleteProduct(@Args('id', ParseUUIDPipe) id: string): Promise<string> {
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
