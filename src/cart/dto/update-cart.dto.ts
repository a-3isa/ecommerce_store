import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ description: 'Product variant ID' })
  @IsUUID()
  productVarId: string;

  @ApiProperty({ description: 'Quantity to update', minimum: 0 })
  @IsInt()
  @Min(0)
  quantity: number;
}
