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
  public search?: string; // Search in name, description, sku

  @IsOptional()
  @IsString()
  public categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public attributeFilters?: string[]; // Array of "attributeId:value" pairs

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  public limit?: number = 10;

  @IsOptional()
  @IsString()
  public sortBy?: string = 'createdAt'; // name, price, createdAt, updatedAt

  @IsOptional()
  @IsString()
  public sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class AttributeFilterDto {
  @IsString()
  public attributeId: string;

  @IsString()
  public value: string;

  @IsOptional()
  @IsString()
  public operator?: 'equals' | 'contains' | 'in' = 'equals';
}
