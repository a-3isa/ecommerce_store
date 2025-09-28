/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  public name: string;

  @IsString()
  public slug: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsUUID()
  public parentId?: string;
}
