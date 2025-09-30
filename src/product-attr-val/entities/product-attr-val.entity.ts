import { Entity, Column, ManyToOne, ManyToMany, Index } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';
import { ProductVariant } from 'src/product-attr-var/entities/product-attr-var.entity';

@Entity('product_attribute_values')
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

  @Column({ type: 'text', unique: true })
  @Index()
  public value: string;

  @ManyToMany(() => ProductVariant, (variant) => variant.attributeValues)
  public variants: ProductVariant[];
}
