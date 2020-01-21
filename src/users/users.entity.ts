import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Geolocation } from '../geolocation/geolocation.entity';
import { UserWord } from './user-words/user-words.entity';

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

  @Column({ comment: '第三方登录提供的id' })
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

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(
    type => Geolocation,
    geolocation => geolocation.user,
  )
  geolocation: Geolocation[];

  @OneToMany(
    type => UserWord,
    userWord => userWord.user,
  )
  words: UserWord[];
}
