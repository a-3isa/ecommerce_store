import { Entity, OneToMany, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CartItem } from './cart-item.entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity('carts')
export class Cart extends CommonEntity {
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  public user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { eager: true })
  public items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public total: number;
}
