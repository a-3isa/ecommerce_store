import { Entity, Column, ManyToOne, ManyToMany, Index } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';
import { ProductVariant } from 'src/product-attr-var/entities/product-attr-var.entity';

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

  //   @Column({ default: true })
  //   @Index()
  //   public isActive: boolean;

  @ManyToMany(() => ProductVariant, (variant) => variant.attributeValues)
  public variants: ProductVariant[];
}
