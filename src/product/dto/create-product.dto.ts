import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { ProductAttributeIdDto } from './product-attribute-id.dto';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsString()
  public slug: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public image?: string;

  // @IsNumber()
  // public price: number;

  @IsNumber()
  @IsOptional()
  public stock?: number = 0;

  @IsString()
  @IsOptional()
  public sku?: string;

  @IsString()
  @IsOptional()
  public barcode?: string;

  // @IsBoolean()
  // @IsOptional()
  // public isActive?: boolean = true;

  @IsString()
  @IsOptional()
  public categoryId?: string;

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  public attributes?: ProductAttributeIdDto[];
}
