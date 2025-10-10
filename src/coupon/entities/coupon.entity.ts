import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Product } from 'src/product/entities/product.entity';

export enum DiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export enum CouponType {
  PRODUCT = 'product',
  ORDER = 'order',
}

@Entity('coupons')
export class Coupon extends CommonEntity {
  @Column({ unique: true, length: 50 })
  public code: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
  })
  public discountType: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public discountValue: number;

  @Column({ type: 'date', nullable: true })
  public expirationDate?: Date;

  @Column({ type: 'int', default: null, nullable: true })
  public usageLimit?: number;

  @Column({ type: 'int', default: 0 })
  public usedCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public minOrderValue: number;

  @Column({ default: true })
  public isActive: boolean;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.ORDER,
  })
  public type: CouponType;

  @ManyToMany(() => Product, { nullable: true })
  @JoinTable()
  public applicableProducts?: Product[];
}
