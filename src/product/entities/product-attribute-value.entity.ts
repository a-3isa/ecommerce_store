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
export class ProductAttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.attributeValues, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  attribute: ProductAttribute;

  @Column({ type: 'text' })
  value: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
