import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 100 })
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  public role: UserRole;

  @Column({ type: 'text', nullable: true })
  public shippingAddress: string[];

  @Column({ type: 'text', nullable: true })
  public billingInfo: string[];

  @OneToOne(() => Cart, (cart) => cart.user)
  public cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  public orders: Order[];
}
