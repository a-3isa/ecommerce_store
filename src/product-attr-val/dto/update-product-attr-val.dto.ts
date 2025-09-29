import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttrValDto } from './create-product-attr-val.dto';

export class UpdateProductAttrValDto extends PartialType(CreateProductAttrValDto) {}
