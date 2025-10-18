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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductAttrService } from './product-attr.service';
import { CreateProductAttributeDto } from './dto/create-product-attr.dto';
import { UpdateProductAttrDto } from './dto/update-product-attr.dto';
import { ProductAttrIdDto } from './dto/product-attr-id.dto';
import { RoleGuard } from 'src/auth/roles.guard';

@ApiTags('product-attributes')
@UseGuards(RoleGuard)
@Controller('product-attr')
export class ProductAttrController {
  constructor(private readonly productAttrService: ProductAttrService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product attribute' })
  @ApiResponse({
    status: 201,
    description: 'Product attribute created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProductAttrDto: CreateProductAttributeDto) {
    return this.productAttrService.create(createProductAttrDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product attributes' })
  @ApiResponse({
    status: 200,
    description: 'List of product attributes',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.productAttrService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product attribute by ID' })
  @ApiParam({ name: 'id', description: 'Product attribute ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute details',
  })
  @ApiResponse({ status: 404, description: 'Product attribute not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param() productAttrId: ProductAttrIdDto) {
    return this.productAttrService.findOne(productAttrId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product attribute' })
  @ApiParam({ name: 'id', description: 'Product attribute ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product attribute not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param() productAttrId: ProductAttrIdDto,
    @Body() updateProductAttrDto: UpdateProductAttrDto,
  ) {
    return this.productAttrService.update(productAttrId, updateProductAttrDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product attribute' })
  @ApiParam({ name: 'id', description: 'Product attribute ID' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product attribute not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param() productAttrId: ProductAttrIdDto) {
    return this.productAttrService.remove(productAttrId);
  }
}
