import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class CategoryAttributeFilterDto {
  @IsString()
  @IsOptional()
  public categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public attributeIds?: string[];

  @IsObject()
  @IsOptional()
  public filters?: {
    isActive?: boolean;
    isRequired?: boolean;
    type?: string;
  };
}

export class CategoryAttributeResponseDto {
  public categoryId: string;
  public categoryName: string;
  public attributes: {
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
