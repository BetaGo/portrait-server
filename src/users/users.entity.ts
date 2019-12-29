import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Geolocation } from '../geolocation/geolocation.entity';
import { Murmur } from '../murmur/murmur.entity';

export enum UserDomain {
  'GITHUB' = 'github.com',
  'WECHAT' = 'weixin.qq.com',
  'WEIBO' = 'weibo.com',
  'MAIN' = 'main',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  displayName: string;

  @Column({
    default: '',
  })
  email: string;

  @Column({
    default: '',
  })
  avatar: string;

  @OneToMany(
    type => Geolocation,
    geolocation => geolocation.user,
  )
  geolocation: Geolocation[];

  @OneToMany(
    type => Murmur,
    murmur => murmur.user,
  )
  murmur: Murmur[];

  @Column({
    type: 'enum',
    enum: UserDomain,
    default: UserDomain.MAIN,
  })
  domain: UserDomain;

  @Column({
    default: '',
  })
  phone: string;
}
