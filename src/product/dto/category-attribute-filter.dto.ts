import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class CategoryAttributeFilterDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attributeIds?: string[];

  @IsObject()
  @IsOptional()
  filters?: {
    isActive?: boolean;
    isRequired?: boolean;
    type?: string;
  };
}

export class CategoryAttributeResponseDto {
  categoryId: string;
  categoryName: string;
  attributes: {
    id: string;
    name: string;
    displayName: string;
    type: string;
    options?: string[];
    isRequired: boolean;
    isActive: boolean;
    sortOrder: number;
  }[];
}
