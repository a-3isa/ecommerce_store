import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity('product_attribute_values')
@Index(['product', 'attribute'], { unique: true })
@Index(['product', 'isActive'])
@Index(['attribute', 'isActive'])
@Index(['attribute', 'value'])
@Index(['product', 'attribute', 'isActive'])
export class ProductAttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.attrValues, {
    onDelete: 'CASCADE',
  })
  @Index()
  product: Product;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  @Index()
  attr: ProductAttribute;

  @Column({ type: 'text' })
  @Index()
  value: string;

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
