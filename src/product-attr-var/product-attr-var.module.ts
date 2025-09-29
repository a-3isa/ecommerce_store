import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttrVarService } from './product-attr-var.service';
import { ProductAttrVarController } from './product-attr-var.controller';
import { ProductVariant } from './entities/product-attr-var.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  controllers: [ProductAttrVarController],
  providers: [ProductAttrVarService],
})
export class ProductAttrVarModule {}
