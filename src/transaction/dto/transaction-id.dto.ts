import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionIdDto {
  @ApiProperty({ description: 'Transaction ID' })
  @IsUUID()
  id: string;
}
