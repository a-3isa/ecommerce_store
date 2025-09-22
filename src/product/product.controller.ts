import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CategoryAttributeFilterDto } from './dto/category-attribute-filter.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() filters: ProductFilterDto) {
    return this.productService.findWithFilters(filters);
  }

  @Get('search')
  searchProducts(@Query('q') searchTerm: string) {
    return this.productService.searchProducts(searchTerm);
  }

  @Get('category/:categoryId')
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getProductsByCategory(categoryId);
  }

  @Get('attribute/:attributeId/:value')
  getProductsByAttribute(
    @Param('attributeId') attributeId: string,
    @Param('value') value: string,
  ) {
    return this.productService.getProductsByAttribute(attributeId, value);
  }

  @Get('category-filters/attributes')
  getCategoryFilterAttributes(@Query() filters: CategoryAttributeFilterDto) {
    return this.productService.getCategoryFilterAttributes(filters.categoryId);
  }

  @Get('category-filters/:categoryId/attribute/:attributeId/values')
  getCategoryAttributeValues(
    @Param('categoryId') categoryId: string,
    @Param('attributeId') attributeId: string,
  ) {
    return this.productService.getCategoryAttributeValues(
      categoryId,
      attributeId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
