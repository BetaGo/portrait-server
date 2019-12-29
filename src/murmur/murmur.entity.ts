import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from '../users/users.entity';

@Entity()
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column()
  time: Date;

  @ManyToOne(
    type => User,
    user => user.murmur,
  )
  user: User;
}
