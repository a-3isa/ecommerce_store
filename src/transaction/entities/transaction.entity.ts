import { Entity, ManyToOne, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('transactions')
export class Transaction extends CommonEntity {
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  public user: User;

  @ManyToOne(() => Order, (order) => order.transactions, {
    onDelete: 'CASCADE',
  })
  public order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  public currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  public paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  public status: TransactionStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public transactionId?: string;

  @Column({ type: 'json', nullable: true })
  public metadata?: Record<string, any>;
}
