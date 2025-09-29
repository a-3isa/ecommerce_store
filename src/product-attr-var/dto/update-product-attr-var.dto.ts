import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttrVarDto } from './create-product-attr-var.dto';

export class UpdateProductAttrVarDto extends PartialType(CreateProductAttrVarDto) {}
