import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from 'src/product-attr-var/entities/product-attr-var.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
    eager: true,
  })
  public cart: Cart;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.cartItems,
    {
      eager: true,
    },
  )
  public productVariant: ProductVariant;

  @Column({ type: 'int', default: 1 })
  public quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public price: number;
}
