import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductAttrValService } from './product-attr-val.service';
import { CreateProductAttrValDto } from './dto/create-product-attr-val.dto';
import { UpdateProductAttrValDto } from './dto/update-product-attr-val.dto';
import { ProductAttrValIdDto } from './dto/product-attr-val-id.dto';

@Controller('product-attr-val')
export class ProductAttrValController {
  constructor(private readonly productAttrValService: ProductAttrValService) {}

  @Post()
  create(@Body() createProductAttrValDto: CreateProductAttrValDto) {
    return this.productAttrValService.create(createProductAttrValDto);
  }

  @Get()
  findAll() {
    return this.productAttrValService.findAll();
  }

  @Get(':id')
  findOne(@Param() productAttrValId: ProductAttrValIdDto) {
    const { id } = productAttrValId;
    return this.productAttrValService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() productAttrValId: ProductAttrValIdDto,
    @Body() updateProductAttrValDto: UpdateProductAttrValDto,
  ) {
    const { id } = productAttrValId;
    return this.productAttrValService.update(id, updateProductAttrValDto);
  }

  @Delete(':id')
  remove(@Param() productAttrValId: ProductAttrValIdDto) {
    const { id } = productAttrValId;
    return this.productAttrValService.remove(id);
  }
}
