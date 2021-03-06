import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { CursorPagination } from '../../common/pagination/cursor-pagination';
import { User } from '../users.entity';
import { UserWord } from './user-words.entity';

@Injectable()
export class UserWordsService {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {}

  /**
   * 每天凌晨两点半更新经验值
   */
  @Cron('0 30 2 * * *')
  // @Cron('30 * * * * *')
  updateExp() {
    this.userWordsRepository
      .createQueryBuilder()
      .update()
      .set({
        exp: () => 'rememberTimes - forgottenTimes',
      })
      .execute();
  }

  create(data: DeepPartial<UserWord>) {
    const word = this.userWordsRepository.create(data);
    return this.userWordsRepository.save(word);
  }

  async createOrUpdate(data: DeepPartial<UserWord>) {
    const existedWord = await this.userWordsRepository.findOne({
      where: {
        word: data.word,
        user: data.user,
      },
    });
    if (existedWord) {
      await this.update(existedWord.id, data);
      return {
        ...data,
        ...existedWord,
      };
    } else {
      return this.create(data);
    }
  }

  findByWord(user: User, word: string) {
    return this.userWordsRepository.findOne({ user, word });
  }

  findById(id: number) {
    return this.userWordsRepository.findOne(id);
  }

  update(id: number, data: DeepPartial<UserWord>) {
    return this.userWordsRepository.update(id, { ...data });
  }

  delete(id: number) {
    return this.userWordsRepository.delete(id);
  }

  async allWordsCursorList(user: User, first: number, after?: string) {
    const queryBuilder = this.userWordsRepository
      .createQueryBuilder('a')
      .where('a.userId = :userId', { userId: user.id })
      .orderBy('id', 'DESC');
    return CursorPagination.cursorList(queryBuilder, first, after);
  }

  async newWordsCursorList(user: User, first?: number, after?: string) {
    const queryBuilder = this.userWordsRepository
      .createQueryBuilder('a')
      .orderBy('exp', 'DESC')
      .orderBy('createdDate', 'DESC')
      .where('a.userId = :userId', { userId: user.id });
    return CursorPagination.cursorList<UserWord>(queryBuilder, first, after);
  }
}
