import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShipmentIndexesDto {
  @ApiProperty({ description: 'Shipping address index' })
  @IsString()
  shippingAddressIndex: string;

  @ApiProperty({ description: 'Billing info index' })
  @IsString()
  billingInfoIndex: string;
}
