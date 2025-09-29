import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttributeDto } from './create-product-attr.dto';

export class UpdateProductAttrDto extends PartialType(
  CreateProductAttributeDto,
) {}
