import { CommonEntity } from 'src/common/entities/common.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  OneToMany,
} from 'typeorm';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Entity('product_variant')
export class ProductVariant extends CommonEntity {
  @Column()
  price: number;

  @Column()
  instructions: string;

  @ManyToOne(() => Product, (product) => product.variants)
  public product: Product;

  @Column({ default: true })
  @Index()
  public isActive: boolean;

  @Column({ type: 'int', default: 0 })
  public stock: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productVariant)
  public cartItems: CartItem[];

  @ManyToMany(() => ProductAttributeValue, (value) => value.variants, {
    eager: true,
  })
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
