import { IsEnum, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export enum CartAction {
  ADD = 'add',
  REMOVE = 'remove',
  SET = 'set',
}

export class CartOperationDto {
  @IsUUID()
  productId: string;

  @IsEnum(CartAction)
  action: CartAction;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdateCartOperationsDto {
  operations: CartOperationDto[];
}
