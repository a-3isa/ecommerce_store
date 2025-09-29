import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductAttrVarService } from './product-attr-var.service';
import { CreateProductAttrVarDto } from './dto/create-product-attr-var.dto';
import { UpdateProductAttrVarDto } from './dto/update-product-attr-var.dto';
import { ProductAttrVarIdDto } from './dto/product-attr-var-id.dto';

@Controller('product-attr-var')
export class ProductAttrVarController {
  constructor(private readonly productAttrVarService: ProductAttrVarService) {}

  @Post()
  create(@Body() createProductAttrVarDto: CreateProductAttrVarDto) {
    return this.productAttrVarService.create(createProductAttrVarDto);
  }

  @Get()
  findAll() {
    return this.productAttrVarService.findAll();
  }

  @Get(':id')
  findOne(@Param() productAttrVarId: ProductAttrVarIdDto) {
    const { id } = productAttrVarId;
    return this.productAttrVarService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() productAttrVarId: ProductAttrVarIdDto,
    @Body() updateProductAttrVarDto: UpdateProductAttrVarDto,
  ) {
    const { id } = productAttrVarId;
    return this.productAttrVarService.update(id, updateProductAttrVarDto);
  }

  @Delete(':id')
  remove(@Param() productAttrVarId: ProductAttrVarIdDto) {
    const { id } = productAttrVarId;
    return this.productAttrVarService.remove(id);
  }
}
