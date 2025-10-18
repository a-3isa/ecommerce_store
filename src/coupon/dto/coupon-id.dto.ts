import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CouponIdDto {
  @ApiProperty({ description: 'Coupon ID' })
  @IsUUID()
  id: string;
}
