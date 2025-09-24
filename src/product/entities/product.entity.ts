import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProductGift } from './product-gift.entity';
import { Category } from 'src/category/entities/category.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';

export enum ProductType {
  SINGLE = 'single',
  VARIANT = 'variant',
  GROUP = 'group',
  GIFT = 'gift',
}

@Entity('products')
@Index(['isActive', 'createdAt'])
@Index(['isActive', 'price'])
@Index(['isActive', 'name'])
@Index(['category', 'isActive'])
@Index(['sku'], { unique: true, where: 'sku IS NOT NULL' })
@Index(['barcode'], { unique: true, where: 'barcode IS NOT NULL' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index()
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Index()
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.SINGLE,
  })
  type: ProductType;

  @Column({ length: 100, unique: true, nullable: true })
  sku: string;

  @Column({ length: 100, unique: true, nullable: true })
  barcode: string;

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.children, { nullable: true })
  parent: Product;

  @OneToMany(() => Product, (product) => product.parent)
  children: Product[];

  @OneToMany(() => ProductGift, (gift) => gift.product)
  gifts: ProductGift[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  attrValues: ProductAttributeValue[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @Index()
  category: Category;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  @Index()
  updatedAt: Date;
}
