export class ProductAttr {}
import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { CommonEntity } from 'src/common/entities/common.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('product_attributes')
export class ProductAttribute extends CommonEntity {
  @Column({ length: 100 })
  public displayName: string; // e.g., "Color", "Size", "Material"

  @ManyToMany(() => Product, (product) => product.attr)
  public products: Product[];

  @OneToMany(() => ProductAttributeValue, (value) => value.attr)
  public values: ProductAttributeValue[];
}
