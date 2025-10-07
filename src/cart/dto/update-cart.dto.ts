import { IsUUID, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsUUID()
  productVarId: string;

  // quantity can be positive (add/update) or zero (remove)
  @IsInt()
  @Min(0)
  quantity: number;

  // optional action, can override behavior if needed
  // @IsOptional()
  // @IsIn(['add', 'remove'])
  // action?: 'add' | 'remove';
}
