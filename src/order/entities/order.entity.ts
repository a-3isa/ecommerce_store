import { Entity, OneToMany, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order extends CommonEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    eager: true,
    cascade: true,
  })
  public items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  public status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  public shippingAddress: string;

  @Column({ type: 'text', nullable: true })
  public billingInfo: string;
}
