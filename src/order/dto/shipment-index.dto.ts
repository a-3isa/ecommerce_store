import { IsString } from 'class-validator';

export class ShipmentIndexesDto {
  @IsString()
  shippingAddressIndex: string;
  @IsString()
  billingInfoIndex: string;
}
