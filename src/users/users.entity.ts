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

export enum ThirdLoginType {
  'GITHUB' = 'GITHUB',
  'WEIBO' = 'WEIBO',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', comment: '第三方登录提供的id' })
  thirdLoginId: string;

  @Column({
    default: '',
    comment: '第三方登录的类型',
  })
  thirdLoginType: string;

  @Column({ length: 32, default: '', comment: '用户账号' })
  username: string;

  @Column({ length: 32, comment: '用户昵称' })
  displayName: string;

  @Column({ default: '' })
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
