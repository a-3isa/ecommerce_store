import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_gifts')
export class ProductGift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.gifts, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  giftProduct: Product;
}
