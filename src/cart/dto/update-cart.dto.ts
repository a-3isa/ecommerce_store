import { IsUUID, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsUUID()
  productVarId: string;

  @IsInt()
  @Min(0)
  quantity: number;
}
