import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity('gift_rules')
export class Gift extends CommonEntity {
  // The "main" product you must buy
  @ManyToOne(() => Product, (product) => product.triggerGift, {
    nullable: false,
  })
  public triggerProduct: Product;

  // How many of that product must be purchased
  @Column({ default: 1 })
  public minQuantity: number;

  // The gift product to be given
  @ManyToMany(() => Product, (product) => product.giftProduct)
  @JoinTable()
  public giftProduct: Product[];

  // How many gifts to give per trigger
  @Column({ default: 1 })
  public giftQuantity: number;

  @Column({ default: true })
  public isActive: boolean;
}
