import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('abstract_entity')
export class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 255 })
  @Index()
  public name?: string;

  @CreateDateColumn()
  @Index()
  public createdAt: Date;

  @UpdateDateColumn()
  @Index()
  public updatedAt: Date;
}
