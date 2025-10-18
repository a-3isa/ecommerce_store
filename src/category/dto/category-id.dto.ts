import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryIdDto {
  @ApiProperty({ description: 'Category ID' })
  @IsUUID()
  id: string;
}
