export class ProductAttr {}
import { Entity, Column, OneToMany, Index, ManyToMany } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import { Product } from 'src/product/entities/product.entity';

// export enum AttributeType {
//   TEXT = 'text',
//   NUMBER = 'number',
//   BOOLEAN = 'boolean',
//   DATE = 'date',
//   SELECT = 'select',
//   MULTISELECT = 'multiselect',
// }

@Entity('product_attributes')
@Index(['isActive', 'sortOrder'])
@Index(['type', 'isActive'])
export class ProductAttribute extends AbstractEntity {
  @Column({ length: 100 })
  public displayName: string; // e.g., "Color", "Size", "Material"

  // @Column({
  //   type: 'enum',
  //   enum: AttributeType,
  //   default: AttributeType.TEXT,
  // })
  // @Index()
  // public type: AttributeType;

  // @Column({ type: 'text', nullable: true })
  // public description: string;

  // @Column({ default: true })
  // @Index()
  // public isRequired: boolean;

  // @Column({ default: true })
  // @Index()
  // public isActive: boolean;

  // @Column({ type: 'simple-json', nullable: true })
  // public validationRules: {
  //   min?: number;
  //   max?: number;
  //   pattern?: string;
  //   required?: boolean;
  // };

  // @Column({ default: 0 })
  // @Index()
  // public sortOrder: number;

  @ManyToMany(() => Product, (products) => products.attrs)
  // @JoinTable()
  public products: Product[];

  @OneToMany(() => ProductAttributeValue, (value) => value.attr)
  public values: ProductAttributeValue[];
}
