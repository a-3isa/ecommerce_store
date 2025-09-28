import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class GetCategoryProductsDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  public page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  public limit: number = 20;

  @IsEnum(['price', 'createdAt'], {
    message: 'sortBy must be either price or createdAt',
  })
  @IsOptional()
  public sortBy?: 'price' | 'createdAt';

  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  public order: 'ASC' | 'DESC' = 'ASC';

  // Example: filters[1]=red&filters[2]=XL
  @IsOptional()
  public filters?: Record<string, string | string[]>;
}
