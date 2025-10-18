import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto } from 'src/common/dto/common.dto';

export class CreateProductDto extends BaseCreateDto {
  @ApiPropertyOptional({ description: 'Stock quantity', default: 0 })
  @IsNumber()
  @IsOptional()
  public stock?: number = 0;

  @ApiProperty({ description: 'SKU' })
  @IsString()
  public sku: string;

  @ApiProperty({ description: 'Barcode' })
  @IsString()
  public barcode: string;

  @ApiProperty({ description: 'Category ID' })
  @IsUUID()
  public categoryId: string;

  @ApiProperty({ description: 'Attribute IDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true }) // ✅ validates each item is a UUID v4
  public attributesId: string[];

  @ApiProperty({ description: 'Attribute value IDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true }) // ✅ validates each item is a UUID v4
  public attributesValId: string[];
}
