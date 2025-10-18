import { IsInt, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGiftDto {
  @ApiProperty({ description: 'ID of the product that triggers the gift' })
  @IsNotEmpty()
  @IsUUID()
  triggerProductId: string;

  @ApiProperty({
    description: 'Minimum quantity required to trigger the gift',
    default: 1,
  })
  @IsInt()
  minQuantity: number = 1;

  @ApiProperty({ description: 'IDs of the gift products', type: [String] })
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  giftProductId: string[];

  @ApiProperty({ description: 'Quantity of the gift product', default: 1 })
  @IsInt()
  giftQuantity: number = 1;

  @ApiProperty({
    description: 'Whether the gift rule is active',
    default: true,
  })
  @IsBoolean()
  isActive: boolean = true;
}
