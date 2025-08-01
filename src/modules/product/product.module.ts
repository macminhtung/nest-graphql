import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductResolver } from '@/modules/product/product.resolver';
import { ProductService } from '@/modules/product/product.service';
import { ProductEntity } from '@/modules/product/product.entity';
import { ElasticModule } from '@/modules/elastic/elastic.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), ElasticModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
