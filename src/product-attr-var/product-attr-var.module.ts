import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttrVarService } from './product-attr-var.service';
import { ProductAttrVarController } from './product-attr-var.controller';
import { ProductVariant } from './entities/product-attr-var.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariant, Product, ProductAttributeValue]),
  ],
  controllers: [ProductAttrVarController],
  providers: [ProductAttrVarService],
})
export class ProductAttrVarModule {}
