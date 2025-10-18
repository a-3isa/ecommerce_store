import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGiftDto } from './create-gift.dto';

export class UpdateGiftDto extends PartialType(CreateGiftDto) {
  @ApiPropertyOptional({
    description: 'ID of the product that triggers the gift',
  })
  triggerProductId?: string;

  @ApiPropertyOptional({
    description: 'Minimum quantity required to trigger the gift',
  })
  minQuantity?: number;

  @ApiPropertyOptional({
    description: 'IDs of the gift products',
    type: [String],
  })
  giftProductId?: string[];

  @ApiPropertyOptional({ description: 'Quantity of the gift product' })
  giftQuantity?: number;

  @ApiPropertyOptional({ description: 'Whether the gift rule is active' })
  isActive?: boolean;
}
