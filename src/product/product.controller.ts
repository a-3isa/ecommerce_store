import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CategoryAttributeFilterDto } from './dto/category-attribute-filter.dto';
import { CacheMedium, CacheLong } from './decorators/cache.decorator';
import { LogMethod } from './decorators/logging.decorator';
import { ValidateRequest } from './decorators/validation.decorator';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @LogMethod()
  @ValidateRequest()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @CacheMedium()
  @LogMethod()
  @ValidateRequest()
  findAll(@Query() filters: ProductFilterDto) {
    return this.productService.findWithFilters(filters);
  }

  @Get('search')
  @CacheMedium()
  @LogMethod()
  @ValidateRequest()
  searchProducts(@Query('q') searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestException(
        'Search term must be at least 2 characters long',
      );
    }
    return this.productService.searchProducts(searchTerm.trim());
  }

  @Get('category/:categoryId')
  @CacheMedium()
  @LogMethod()
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }
    return this.productService.getProductsByCategory(categoryId);
  }

  @Get('attribute/:attributeId/:value')
  @CacheMedium()
  @LogMethod()
  getProductsByAttribute(
    @Param('attributeId') attributeId: string,
    @Param('value') value: string,
  ) {
    if (!attributeId || !value) {
      throw new BadRequestException('Both attribute ID and value are required');
    }
    return this.productService.getProductsByAttribute(attributeId, value);
  }

  @Get('category-filters/attributes')
  @CacheLong()
  @LogMethod()
  @ValidateRequest()
  getCategoryFilterAttributes(@Query() filters: CategoryAttributeFilterDto) {
    return this.productService.getCategoryFilterAttributes(filters.categoryId);
  }

  @Get('category-filters/:categoryId/attribute/:attributeId/values')
  @CacheMedium()
  @LogMethod()
  getCategoryAttributeValues(
    @Param('categoryId') categoryId: string,
    @Param('attributeId') attributeId: string,
  ) {
    if (!categoryId || !attributeId) {
      throw new BadRequestException(
        'Both category ID and attribute ID are required',
      );
    }
    return this.productService.getCategoryAttributeValues(
      categoryId,
      attributeId,
    );
  }

  @Get(':id')
  @CacheMedium()
  @LogMethod()
  async findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @LogMethod()
  @ValidateRequest()
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update product');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogMethod()
  async remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    try {
      await this.productService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete product');
    }
  }
}
