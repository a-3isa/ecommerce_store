import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductAttrService } from './product-attr.service';
import { CreateProductAttributeDto } from './dto/create-product-attr.dto';
import { UpdateProductAttrDto } from './dto/update-product-attr.dto';
import { ProductAttrIdDto } from './dto/product-attr-id.dto';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(RoleGuard)
@Controller('product-attr')
export class ProductAttrController {
  constructor(private readonly productAttrService: ProductAttrService) {}

  @Post()
  create(@Body() createProductAttrDto: CreateProductAttributeDto) {
    return this.productAttrService.create(createProductAttrDto);
  }

  @Get()
  findAll() {
    return this.productAttrService.findAll();
  }

  @Get(':id')
  findOne(@Param() productAttrId: ProductAttrIdDto) {
    return this.productAttrService.findOne(productAttrId);
  }

  @Patch(':id')
  update(
    @Param() productAttrId: ProductAttrIdDto,
    @Body() updateProductAttrDto: UpdateProductAttrDto,
  ) {
    return this.productAttrService.update(productAttrId, updateProductAttrDto);
  }

  @Delete(':id')
  remove(@Param() productAttrId: ProductAttrIdDto) {
    return this.productAttrService.remove(productAttrId);
  }
}
