import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttrValService } from './product-attr-val.service';
import { ProductAttrValController } from './product-attr-val.controller';
import { ProductAttributeValue } from './entities/product-attr-val.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributeValue])],
  controllers: [ProductAttrValController],
  providers: [ProductAttrValService],
})
export class ProductAttrValModule {}
