import { PartialType } from '@nestjs/mapped-types';
import { BaseUpdateDto } from 'src/common/dto/common.dto';

export class UpdateProductAttrDto extends PartialType(BaseUpdateDto) {}
