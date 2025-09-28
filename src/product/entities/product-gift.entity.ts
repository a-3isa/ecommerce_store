import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';

@Entity('gift_rules')
export class GiftRule extends AbstractEntity {
  // The "main" product you must buy
  @ManyToOne(() => Product, { nullable: false })
  public triggerProduct: Product;

  // How many of that product must be purchased
  @Column({ default: 1 })
  public minQuantity: number;

  // The gift product to be given
  @ManyToOne(() => Product, { nullable: false })
  public giftProduct: Product;

  // How many gifts to give per trigger
  @Column({ default: 1 })
  public giftQuantity: number;

  @Column({ default: true })
  public isActive: boolean;
}
