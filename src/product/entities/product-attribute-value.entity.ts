import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Product } from './product.entity';
import { ProductAttribute } from './product-attribute.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';

@Entity('product_attribute_values')
@Index(['product', 'attribute'], { unique: true })
@Index(['product', 'isActive'])
@Index(['attribute', 'isActive'])
@Index(['attribute', 'value'])
@Index(['product', 'attribute', 'isActive'])
export class ProductAttributeValue extends AbstractEntity {
  @ManyToOne(() => Product, (product) => product.attrValues, {
    onDelete: 'CASCADE',
  })
  @Index()
  public product: Product;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  @Index()
  public attr: ProductAttribute;

  @Column({ type: 'text' })
  @Index()
  public value: string;

  @Column({ default: true })
  @Index()
  public isActive: boolean;
}
