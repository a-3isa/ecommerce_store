import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttrVarDto } from './create-product-attr-var.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductAttrVarDto extends PartialType(
  CreateProductAttrVarDto,
) {
  @ApiPropertyOptional({
    description: 'Price of the product attribute variation',
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Instructions for the product attribute variation',
  })
  instructions?: string;

  @ApiPropertyOptional({ description: 'ID of the associated product' })
  productId?: string;

  @ApiPropertyOptional({ description: 'Stock quantity for the variation' })
  stock?: number;

  @ApiPropertyOptional({
    description: 'Array of attribute value IDs',
    type: [String],
  })
  attributeValueIds?: string[];
}
