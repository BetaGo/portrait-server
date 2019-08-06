import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Category } from '../categories/categories.entity';
import { Tag } from '../tags/tags.entity';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  value: number;

  @Column({ nullable: true, type: 'simple-array' })
  tagIds: number[];

  @ManyToMany(type => Tag, tag => tag.actions)
  @JoinTable()
  tags: Tag[];

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(type => Category, category => category.actions)
  category: Category;

  @Column({
    type: 'text',
  })
  description: string;

  @ManyToOne(type => User, user => user.actions)
  user: User;

  @Column()
  date: Date;
}
