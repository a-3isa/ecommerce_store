import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  public cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  public product: Product;

  @Column({ type: 'int', default: 1 })
  public quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public price: number;
}
