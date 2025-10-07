import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  public order: Order;

  @ManyToOne(() => Product, { eager: true })
  public product: Product;

  @Column({ type: 'int', default: 1 })
  public quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public price: number;
}
