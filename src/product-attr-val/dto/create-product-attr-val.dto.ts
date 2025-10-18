import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttrValDto {
  @ApiProperty({ description: 'ID of the product attribute' })
  @IsString()
  attrId: string;

  @ApiProperty({ description: 'Value of the product attribute' })
  @IsString()
  value: string;
}
