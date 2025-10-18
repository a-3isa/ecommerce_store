import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CacheInterceptor } from 'node_modules/@nestjs/cache-manager';
import { FileInterceptor } from 'node_modules/@nestjs/platform-express';
import { LogMethod } from './decorators/logging.decorator';
import { ValidateRequest } from './decorators/validation.decorator';

@ApiTags('products')
@Controller('product')
// @UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string' },
        stock: { type: 'number' },
        sku: { type: 'string' },
        barcode: { type: 'string' },
        categoryId: { type: 'string' },
        attributesId: { type: 'array', items: { type: 'string' } },
        attributesValId: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @LogMethod()
  @ValidateRequest()
  public create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto, file);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  public findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  public async findOne(@Param() productId: ProductIdDto) {
    const { id } = productId;
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @LogMethod()
  @ValidateRequest()
  public async update(
    @Param('id') productId: ProductIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const { id } = productId;

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
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @LogMethod()
  public async remove(@Param('id') id: ProductIdDto) {
    try {
      await this.productService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete product');
    }
  }

  @Get('search')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Search products with filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @LogMethod()
  @ValidateRequest()
  public async searchProducts(@Query() filterDto: ProductFilterDto) {
    return this.productService.searchProducts(filterDto);
  }
}
