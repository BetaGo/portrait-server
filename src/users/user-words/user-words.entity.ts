import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  AfterLoad,
} from 'typeorm';

import { User } from '../users.entity';

@Entity()
@Unique(['word', 'user'])
export class UserWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, comment: '单词' })
  word: string;

  @Column({ length: 512, comment: '用户自定单词的翻译', default: '' })
  translation: string;

  @Column({ length: 512, comment: '用户自定单词例句', default: '' })
  example: string;

  @Column({ type: 'int', comment: '遗忘的次数', default: 1 })
  forgottenTimes: number;

  @Column({ type: 'int', comment: '记住的次数', default: 0 })
  rememberTimes: number;

  @Column({ type: 'tinyint', comment: '忽略该单词', default: 0 })
  ignore: number;

  @Column({ type: 'int', comment: '单词经验值', default: 0 })
  exp: number;

  @Column({
    type: 'tinyint',
    comment: '是否已掌握, 0: 未掌握, 1: 已掌握',
    default: 0,
  })
  isKnown: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne((type) => User, (user) => user.words)
  user: User;
}
