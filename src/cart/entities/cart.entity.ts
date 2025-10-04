import { Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from './cart-item.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('carts')
export class Cart extends CommonEntity {
  @OneToOne(() => User, (user) => user.cart, { eager: true })
  @JoinColumn()
  public user: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    eager: true,
    cascade: true,
  })
  public items: CartItem[];
}
