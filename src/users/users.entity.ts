import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
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
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', comment: '第三方登录提供的id' })
  uid: string;

  @Column({ length: 32, comment: '用户账号' })
  username: string;

  @Column({ length: 32, comment: '用户昵称' })
  displayName: string;

  @Column()
  password: string;

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
