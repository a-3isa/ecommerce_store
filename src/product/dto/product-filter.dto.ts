import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  search?: string; // Search in name, description, sku

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attributeFilters?: string[]; // Array of "attributeId:value" pairs

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // name, price, createdAt, updatedAt

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class AttributeFilterDto {
  @IsString()
  attributeId: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  operator?: 'equals' | 'contains' | 'in' = 'equals';
}
