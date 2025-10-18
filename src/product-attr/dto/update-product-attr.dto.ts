import { PartialType } from '@nestjs/mapped-types';
import { BaseUpdateDto } from 'src/common/dto/common.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductAttrDto extends PartialType(BaseUpdateDto) {
  @ApiPropertyOptional({ description: 'Display name of the product attribute' })
  displayName?: string;
}
