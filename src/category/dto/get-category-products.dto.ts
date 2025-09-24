import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class GetCategoryProductsDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 20;

  @IsEnum(['price', 'createdAt'], {
    message: 'sortBy must be either price or createdAt',
  })
  @IsOptional()
  sortBy?: 'price' | 'createdAt';

  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order: 'ASC' | 'DESC' = 'ASC';

  // Example: filters[1]=red&filters[2]=XL
  @IsOptional()
  filters?: Record<string, string | string[]>;
}
