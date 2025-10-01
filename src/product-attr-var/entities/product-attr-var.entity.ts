import { CommonEntity } from 'src/common/entities/common.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity('product_variant')
export class ProductVariant extends CommonEntity {
  @Column()
  price: number;

  @Column()
  instructions: string;

  @ManyToOne(() => Product, (product) => product.variants)
  public product: Product;

  @ManyToMany(() => ProductAttributeValue, (value) => value.variants)
  @JoinTable({
    name: 'product_variant_attribute_values',
    joinColumn: {
      name: 'variant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'attribute_value_id',
      referencedColumnName: 'id',
    },
  })
  public attributeValues: ProductAttributeValue[];
}
