import { CommonEntity } from 'src/common/entities/common.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class Category extends CommonEntity {
  @Column({ length: 255, unique: true })
  public slug: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  public parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  public children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  public products: Product[];
}
