import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Action } from '../actions/actions.entity';

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

  @OneToMany(type => Action, action => action.user)
  actions: Action[];

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
