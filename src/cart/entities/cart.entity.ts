import { Entity, OneToMany, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from './cart-item.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('carts')
export class Cart extends CommonEntity {
  @OneToOne(() => User, (user) => user.cart, { eager: true })
  @JoinColumn()
  public user: User;

  @OneToMany(() => CartItem, (item) => item.cart)
  public items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public total: number;

  // @OneToMany(() => Order, (order) => order.cart)
  // order: Order;
}
