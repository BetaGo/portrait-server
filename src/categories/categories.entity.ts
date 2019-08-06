import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Action } from '../actions/actions.entity';

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

  @OneToMany(type => Action, action => action.category)
  actions: Action[];

  @Column()
  userId: number;
}
