import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttrValDto } from './create-product-attr-val.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductAttrValDto extends PartialType(
  CreateProductAttrValDto,
) {
  @ApiPropertyOptional({ description: 'ID of the product attribute' })
  attrId?: string;

  @ApiPropertyOptional({ description: 'Value of the product attribute' })
  value?: string;
}
