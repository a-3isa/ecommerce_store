import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
} from 'class-validator';
import { ProductType } from '../entities/product.entity';
import { CreateProductAttributeValueDto } from './product-attribute.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  stock?: number = 0;

  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType = ProductType.SINGLE;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  attributes?: CreateProductAttributeValueDto[];
}
