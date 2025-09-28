import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { CacheMedium } from './decorators/cache.decorator';
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
  public create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get(':id')
  @CacheMedium()
  @LogMethod()
  public async findOne(@Param('id') id: string) {
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
  public async update(
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
  public async remove(@Param('id') id: string) {
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
