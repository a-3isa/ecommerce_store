import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductAttrVarService } from './product-attr-var.service';
import { CreateProductAttrVarDto } from './dto/create-product-attr-var.dto';
import { UpdateProductAttrVarDto } from './dto/update-product-attr-var.dto';
import { ProductAttrVarIdDto } from './dto/product-attr-var-id.dto';
import { CacheInterceptor } from 'node_modules/@nestjs/cache-manager';

@ApiTags('product-attribute-variations')
@Controller('product-attr-var')
export class ProductAttrVarController {
  constructor(private readonly productAttrVarService: ProductAttrVarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product attribute variation' })
  @ApiResponse({
    status: 201,
    description: 'Product attribute variation created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProductAttrVarDto: CreateProductAttrVarDto) {
    return this.productAttrVarService.create(createProductAttrVarDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all product attribute variations' })
  @ApiResponse({
    status: 200,
    description: 'List of product attribute variations',
  })
  findAll() {
    return this.productAttrVarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product attribute variation by ID' })
  @ApiParam({ name: 'id', description: 'Product attribute variation ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute variation details',
  })
  @ApiResponse({
    status: 404,
    description: 'Product attribute variation not found',
  })
  findOne(@Param() productAttrVarId: ProductAttrVarIdDto) {
    const { id } = productAttrVarId;
    return this.productAttrVarService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product attribute variation' })
  @ApiParam({ name: 'id', description: 'Product attribute variation ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute variation updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product attribute variation not found',
  })
  update(
    @Param() productAttrVarId: ProductAttrVarIdDto,
    @Body() updateProductAttrVarDto: UpdateProductAttrVarDto,
  ) {
    const { id } = productAttrVarId;
    return this.productAttrVarService.update(id, updateProductAttrVarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product attribute variation' })
  @ApiParam({ name: 'id', description: 'Product attribute variation ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute variation deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product attribute variation not found',
  })
  remove(@Param() productAttrVarId: ProductAttrVarIdDto) {
    const { id } = productAttrVarId;
    return this.productAttrVarService.remove(id);
  }
}
