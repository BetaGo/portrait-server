import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({
    type: 'simple-array',
  })
  tagIds: number[];

  @Column()
  categoryId: number;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  userId: number;

  @Column()
  createTime: Date;
}
