import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.children, { nullable: true })
  parent: Product;

  @OneToMany(() => Product, (product) => product.parent)
  children: Product[];

  @OneToMany(() => ProductGift, (gift) => gift.product)
  gifts: ProductGift[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  attributeValues: ProductAttributeValue[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
