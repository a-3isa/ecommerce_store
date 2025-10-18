import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GiftIdDto {
  @ApiProperty({ description: 'Gift rule ID' })
  @IsUUID()
  id: string;
}
