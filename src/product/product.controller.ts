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
import { ProductIdDto } from './dto/product-id.dto';

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

  @Get()
  @CacheMedium()
  @LogMethod()
  public findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @CacheMedium()
  @LogMethod()
  public async findOne(@Param('id') productId: ProductIdDto) {
    const { id } = productId;
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
  @HttpCode(HttpStatus.NO_CONTENT)
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
}
