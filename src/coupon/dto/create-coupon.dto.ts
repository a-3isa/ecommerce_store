import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, CouponType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @ApiProperty({ description: 'Unique coupon code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Type of discount', enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  discountValue: number;

  @ApiPropertyOptional({ description: 'Expiration date of the coupon' })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({ description: 'Maximum number of uses' })
  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @ApiProperty({ description: 'Minimum order value required' })
  @IsNumber({ maxDecimalPlaces: 2 })
  minOrderValue: number;

  @ApiPropertyOptional({
    description: 'Whether the coupon is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Type of coupon', enum: CouponType })
  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @ApiPropertyOptional({
    description: 'Applicable product IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  applicableProductIds?: string[];
}
