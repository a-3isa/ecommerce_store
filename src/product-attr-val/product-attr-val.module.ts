import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttrValService } from './product-attr-val.service';
import { ProductAttrValController } from './product-attr-val.controller';
import { ProductAttributeValue } from './entities/product-attr-val.entity';
import { ProductAttrModule } from 'src/product-attr/product-attr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAttributeValue]),
    ProductAttrModule,
  ],
  controllers: [ProductAttrValController],
  providers: [ProductAttrValService],
  exports: [ProductAttrValService, TypeOrmModule],
})
export class ProductAttrValModule {}
