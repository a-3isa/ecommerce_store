import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProductAttributeValue } from './product-attribute-value.entity';

export enum AttributeType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}

@Entity('product_attributes')
@Index(['isActive', 'sortOrder'])
@Index(['type', 'isActive'])
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  @Index()
  name: string; // e.g., "color", "size", "material"

  @Column({ length: 100 })
  displayName: string; // e.g., "Color", "Size", "Material"

  @Column({
    type: 'enum',
    enum: AttributeType,
    default: AttributeType.TEXT,
  })
  @Index()
  type: AttributeType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  @Index()
  isRequired: boolean;

  @Column({ default: true })
  @Index()
  isActive: boolean;

  @Column({ type: 'simple-json', nullable: true })
  validationRules: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };

  @Column({ default: 0 })
  @Index()
  sortOrder: number;

  @OneToMany(() => ProductAttributeValue, (value) => value.attr)
  values: ProductAttributeValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
