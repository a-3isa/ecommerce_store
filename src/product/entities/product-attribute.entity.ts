import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductAttributeValue } from './product-attribute-value.entity';
// import { ProductAttributeValue } from './product-attribute-value.entity';

export enum AttributeType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}

@Entity('product_attributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string; // e.g., "color", "size", "material"

  @Column({ length: 100 })
  displayName: string; // e.g., "Color", "Size", "Material"

  @Column({
    type: 'enum',
    enum: AttributeType,
    default: AttributeType.TEXT,
  })
  type: AttributeType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isRequired: boolean;

  @Column({ default: true })
  isActive: boolean;

  //   @Column({ type: 'simple-json', nullable: true })
  //   options: string[]; // For select/multiselect types, e.g., ["Red", "Blue", "Green"]

  @Column({ type: 'simple-json', nullable: true })
  validationRules: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };

  @Column({ default: 0 })
  sortOrder: number;

  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  values: ProductAttributeValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
