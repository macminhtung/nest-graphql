import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProductResolver } from '@/modules/product/product.resolver';
import { ProductService } from '@/modules/product/product.service';
import { ProductEntity } from '@/modules/product/product.entity';
import { ElasticModule } from '@/modules/elastic/elastic.module';

@Module({
  imports: [MikroOrmModule.forFeature([ProductEntity]), ElasticModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
