import { IsInt, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGiftDto {
  @IsNotEmpty()
  @IsUUID()
  triggerProductId: string;

  @IsInt()
  minQuantity: number = 1;

  @IsNotEmpty()
  @IsUUID('4', { each: true })
  giftProductId: string[];

  @IsInt()
  giftQuantity: number = 1;

  @IsBoolean()
  isActive: boolean = true;
}
