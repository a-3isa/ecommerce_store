import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';
import { AttributeType } from '../entities/product-attribute.entity';

export class CreateProductAttributeDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEnum(AttributeType)
  @IsOptional()
  type?: AttributeType = AttributeType.TEXT;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsObject()
  @IsOptional()
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };

  @IsOptional()
  sortOrder?: number = 0;
}

export class UpdateProductAttributeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEnum(AttributeType)
  @IsOptional()
  type?: AttributeType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsObject()
  @IsOptional()
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };

  @IsOptional()
  sortOrder?: number;
}

export class CreateProductAttributeValueDto {
  @IsString()
  attributeId: string;

  @IsString()
  value: string;

  @IsObject()
  @IsOptional()
  metadata?: {
    unit?: string;
    currency?: string;
    locale?: string;
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdateProductAttributeValueDto {
  @IsString()
  @IsOptional()
  value?: string;

  @IsObject()
  @IsOptional()
  metadata?: {
    unit?: string;
    currency?: string;
    locale?: string;
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
