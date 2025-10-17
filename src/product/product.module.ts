import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import { Category } from 'src/category/entities/category.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
// import { ProductGift } from './entities/product-gift.entity';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([
      Product,
      // ProductGift,
      ProductAttribute,
      ProductAttributeValue,
      Category,
    ]),
    CacheModule.register({
      ttl: 300, // 5 minutes default TTL
      max: 1000, // Maximum number of items in cache
      isGlobal: false,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
