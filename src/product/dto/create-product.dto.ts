import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseCreateDto } from 'src/common/dto/common.dto';

export class CreateProductDto extends BaseCreateDto {
  @IsString()
  @IsOptional()
  public image?: string;

  @IsNumber()
  @IsOptional()
  public stock?: number = 0;

  @IsString()
  public sku: string;

  @IsString()
  public barcode: string;

  @IsUUID()
  public categoryId: string;

  @IsArray()
  @IsUUID('4', { each: true }) // ✅ validates each item is a UUID v4
  public attributesId: string[];

  @IsArray()
  @IsUUID('4', { each: true }) // ✅ validates each item is a UUID v4
  public attributesValId: string[];
}
