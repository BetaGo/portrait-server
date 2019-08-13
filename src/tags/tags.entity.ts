import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Record } from '../records/records.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @ManyToMany(type => Record, record => record.tags)
  actions: Record[];

  @Column()
  userId: number;
}
