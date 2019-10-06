import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/users.entity';

@Entity()
export class Geolocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'double'})
  latitude: number;

  @Column({type: 'double'})
  longitude: number;

  @ManyToOne(type => User, user => user.geolocation)
  user: User;

  @Column()
  date: Date;
}
