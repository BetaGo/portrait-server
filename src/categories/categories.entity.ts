import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Record } from '../records/records.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({
    default: null,
    nullable: true,
  })
  parentId: number;

  @OneToMany(type => Record, action => action.category)
  actions: Record[];

  @Column()
  userId: number;
}
