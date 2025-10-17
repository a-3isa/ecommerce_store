import { IsString, IsNotEmpty } from 'class-validator';

export class CouponCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
