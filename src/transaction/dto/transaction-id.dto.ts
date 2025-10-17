import { IsUUID } from 'class-validator';

export class TransactionIdDto {
  @IsUUID()
  id: string;
}
