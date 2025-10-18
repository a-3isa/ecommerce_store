import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductAttrValService } from './product-attr-val.service';
import { CreateProductAttrValDto } from './dto/create-product-attr-val.dto';
import { UpdateProductAttrValDto } from './dto/update-product-attr-val.dto';
import { ProductAttrValIdDto } from './dto/product-attr-val-id.dto';

@ApiTags('product-attribute-values')
@Controller('product-attr-val')
export class ProductAttrValController {
  constructor(private readonly productAttrValService: ProductAttrValService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product attribute value' })
  @ApiResponse({
    status: 201,
    description: 'Product attribute value created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProductAttrValDto: CreateProductAttrValDto) {
    return this.productAttrValService.create(createProductAttrValDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product attribute values' })
  @ApiResponse({
    status: 200,
    description: 'List of product attribute values',
  })
  findAll() {
    return this.productAttrValService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product attribute value by ID' })
  @ApiParam({ name: 'id', description: 'Product attribute value ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute value details',
  })
  @ApiResponse({
    status: 404,
    description: 'Product attribute value not found',
  })
  findOne(@Param() productAttrValId: ProductAttrValIdDto) {
    const { id } = productAttrValId;
    return this.productAttrValService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product attribute value' })
  @ApiParam({ name: 'id', description: 'Product attribute value ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute value updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product attribute value not found',
  })
  update(
    @Param() productAttrValId: ProductAttrValIdDto,
    @Body() updateProductAttrValDto: UpdateProductAttrValDto,
  ) {
    const { id } = productAttrValId;
    return this.productAttrValService.update(id, updateProductAttrValDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product attribute value' })
  @ApiParam({ name: 'id', description: 'Product attribute value ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute value deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product attribute value not found',
  })
  remove(@Param() productAttrValId: ProductAttrValIdDto) {
    const { id } = productAttrValId;
    return this.productAttrValService.remove(id);
  }
}
