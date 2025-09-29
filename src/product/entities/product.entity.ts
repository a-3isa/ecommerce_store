import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  ManyToMany,
} from 'typeorm';
// import { ProductGift } from './product-gift.entity';
import { Category } from 'src/category/entities/category.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
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
@Index(['isActive', 'price'])
@Index(['isActive', 'name'])
@Index(['category', 'isActive'])
@Index(['sku'], { unique: true, where: 'sku IS NOT NULL' })
@Index(['barcode'], { unique: true, where: 'barcode IS NOT NULL' })
export class Product extends AbstractEntity {
  @Column({ length: 255, unique: true })
  public slug: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Index()
  public price: number;

  @Column({ type: 'int', default: 0 })
  public stock: number;

  // @Column({
  //   type: 'enum',
  //   enum: ProductType,
  //   default: ProductType.SINGLE,
  // })
  // public type: ProductType;

  @Column({ length: 100, unique: true, nullable: true })
  public sku: string;

  @Column({ length: 100, unique: true, nullable: true })
  public barcode: string;

  @Column({ default: true })
  @Index()
  public isActive: boolean;

  // @ManyToOne(() => Product, (product) => product.children, { nullable: true })
  // public parent: Product;

  // @OneToMany(() => Product, (product) => product.parent)
  // public children: Product[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  public variants: ProductVariant[];

  @ManyToMany(() => ProductAttribute, (attrs) => attrs.products)
  public attrs: ProductAttribute[];
  // @OneToMany(() => ProductGift, (gift) => gift.product)
  // public gifts: ProductGift[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  public attrValues: ProductAttributeValue[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @Index()
  public category: Category;
}
