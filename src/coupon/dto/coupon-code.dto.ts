import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CouponCodeDto {
  @ApiProperty({ description: 'Coupon code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
