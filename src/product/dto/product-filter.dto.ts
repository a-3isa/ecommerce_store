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
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ProductFilterDto {
  @ApiPropertyOptional({ description: 'Search in name, description, sku' })
  @IsOptional()
  @IsString()
  public search?: string; // Search in name, description, sku

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  public categoryId?: string;

  @ApiPropertyOptional({ description: 'Minimum price', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public maxPrice?: number;

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  public isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Attribute filters', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public attributeFilters?: string[]; // Array of "attributeId:value" pairs

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  public limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort by field', default: 'createdAt' })
  @IsOptional()
  @IsString()
  public sortBy?: string = 'createdAt'; // name, price, createdAt, updatedAt

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  public sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class AttributeFilterDto {
  @ApiProperty({ description: 'Attribute ID' })
  @IsString()
  public attributeId: string;

  @ApiProperty({ description: 'Value' })
  @IsString()
  public value: string;

  @ApiPropertyOptional({
    description: 'Operator',
    enum: ['equals', 'contains', 'in'],
    default: 'equals',
  })
  @IsOptional()
  @IsString()
  public operator?: 'equals' | 'contains' | 'in' = 'equals';
}
