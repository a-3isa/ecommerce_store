import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';
import { DiscountType, CouponType } from '../entities/coupon.entity';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @ApiPropertyOptional({ description: 'Unique coupon code' })
  code?: string;

  @ApiPropertyOptional({ description: 'Type of discount', enum: DiscountType })
  discountType?: DiscountType;

  @ApiPropertyOptional({
    description: 'Discount value (percentage or fixed amount)',
  })
  discountValue?: number;

  @ApiPropertyOptional({ description: 'Expiration date of the coupon' })
  expirationDate?: string;

  @ApiPropertyOptional({ description: 'Maximum number of uses' })
  usageLimit?: number;

  @ApiPropertyOptional({ description: 'Minimum order value required' })
  minOrderValue?: number;

  @ApiPropertyOptional({ description: 'Whether the coupon is active' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Type of coupon', enum: CouponType })
  type?: CouponType;

  @ApiPropertyOptional({
    description: 'Applicable product IDs',
    type: [String],
  })
  applicableProductIds?: string[];
}
