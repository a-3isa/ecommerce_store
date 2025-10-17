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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CacheInterceptor } from 'node_modules/@nestjs/cache-manager';
import { FileInterceptor } from 'node_modules/@nestjs/platform-express';
import { LogMethod } from './decorators/logging.decorator';
import { ValidateRequest } from './decorators/validation.decorator';

@Controller('product')
// @UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
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
  public findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  public async findOne(@Param() productId: ProductIdDto) {
    const { id } = productId;
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  @Patch(':id')
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
  @LogMethod()
  @ValidateRequest()
  public async searchProducts(@Query() filterDto: ProductFilterDto) {
    return this.productService.searchProducts(filterDto);
  }
}
