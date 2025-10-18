import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @ApiProperty({ description: 'Display name of the product attribute' })
  @IsString()
  public displayName: string;
}
