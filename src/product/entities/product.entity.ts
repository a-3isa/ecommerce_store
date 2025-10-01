import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
// import { ProductGift } from './product-gift.entity';
import { Category } from 'src/category/entities/category.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import { ProductVariant } from 'src/product-attr-var/entities/product-attr-var.entity';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';

// export enum ProductType {
//   SINGLE = 'single',
//   VARIANT = 'variant',
//   GROUP = 'group',
//   GIFT = 'gift',
// }

@Entity('products')
@Index(['isActive', 'createdAt'])
@Index(['isActive', 'name'])
@Index(['category', 'isActive'])
@Index(['sku'], { unique: true, where: 'sku IS NOT NULL' })
@Index(['barcode'], { unique: true, where: 'barcode IS NOT NULL' })
export class Product extends CommonEntity {
  @Column({ length: 255, unique: true })
  public slug: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public image: string;

  @Column({ type: 'int', default: 0 })
  public stock: number;

  @Column({ length: 100, unique: true, nullable: true })
  public sku: string;

  @Column({ length: 100, unique: true, nullable: true })
  public barcode: string;

  @Column({ default: true })
  @Index()
  public isActive: boolean;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    eager: true,
  })
  public variants: ProductVariant[];

  @ManyToMany(() => ProductAttribute, (attr) => attr.products, { eager: true })
  @JoinTable()
  public attr: ProductAttribute[];
  // @OneToMany(() => ProductGift, (gift) => gift.product)
  // public gifts: ProductGift[];

  @ManyToMany(() => ProductAttributeValue, (value) => value.products, {
    eager: true,
  })
  @JoinTable()
  public attrValues: ProductAttributeValue[];

  @ManyToOne(() => Category, (category) => category.products)
  @Index()
  public category: Category;
}
