import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
