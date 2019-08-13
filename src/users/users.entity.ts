import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Record } from '../records/records.entity';

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

  @OneToMany(type => Record, record => record.user)
  actions: Record[];

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
