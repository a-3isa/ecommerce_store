import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttrService } from './product-attr.service';
import { ProductAttrController } from './product-attr.controller';
import { ProductAttribute } from './entities/product-attr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttribute])],
  controllers: [ProductAttrController],
  providers: [ProductAttrService],
})
export class ProductAttrModule {}
