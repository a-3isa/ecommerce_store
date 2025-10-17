import { IsUUID } from 'class-validator';

export class CouponIdDto {
  @IsUUID()
  id: string;
}
