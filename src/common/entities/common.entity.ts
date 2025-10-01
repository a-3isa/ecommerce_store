import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('common_entity')
export class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 255, nullable: true })
  @Index()
  public name?: string;

  @CreateDateColumn()
  @Index()
  public createdAt: Date;

  @UpdateDateColumn()
  @Index()
  public updatedAt: Date;
}
