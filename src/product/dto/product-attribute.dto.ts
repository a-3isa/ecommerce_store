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
  public name: string;

  @IsString()
  public displayName: string;

  @IsEnum(AttributeType)
  @IsOptional()
  public type?: AttributeType = AttributeType.TEXT;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public isRequired?: boolean = false;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public options?: string[];

  @IsObject()
  @IsOptional()
  public validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };

  @IsOptional()
  public sortOrder?: number = 0;
}

export class UpdateProductAttributeDto {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public displayName?: string;

  @IsEnum(AttributeType)
  @IsOptional()
  public type?: AttributeType;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public options?: string[];

  @IsObject()
  @IsOptional()
  public validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };

  @IsOptional()
  public sortOrder?: number;
}

export class CreateProductAttributeValueDto {
  @IsString()
  public attributeId: string;

  @IsString()
  public value: string;

  @IsObject()
  @IsOptional()
  public metadata?: {
    unit?: string;
    currency?: string;
    locale?: string;
  };

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean = true;
}

export class UpdateProductAttributeValueDto {
  @IsString()
  @IsOptional()
  public value?: string;

  @IsObject()
  @IsOptional()
  public metadata?: {
    unit?: string;
    currency?: string;
    locale?: string;
  };

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;
}
