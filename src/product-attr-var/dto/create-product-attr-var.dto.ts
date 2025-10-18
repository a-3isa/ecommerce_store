import {
  IsNumber,
  IsString,
  IsUUID,
  IsArray,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttrVarDto {
  @ApiProperty({ description: 'Price of the product attribute variation' })
  @IsNumber()
  public price: number;

  @ApiProperty({
    description: 'Instructions for the product attribute variation',
  })
  @IsString()
  public instructions: string;

  @ApiProperty({ description: 'ID of the associated product' })
  @IsUUID()
  public productId: string;

  @ApiProperty({ description: 'Stock quantity for the variation' })
  @IsPositive()
  public stock: number;

  @ApiProperty({
    description: 'Array of attribute value IDs',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  public attributeValueIds: string[];
}
