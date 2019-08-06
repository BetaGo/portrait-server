import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Action } from '../actions/actions.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @ManyToMany(type => Action, action => action.tags)
  actions: Action[];

  @Column()
  userId: number;
}
