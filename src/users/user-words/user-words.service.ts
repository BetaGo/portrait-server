import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  MoreThan,
  Repository,
  QueryBuilder,
  SelectQueryBuilder,
} from 'typeorm';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';

import { User } from '../users.entity';
import { UserWord } from './user-words.entity';
import { CursorPagination } from '../../common/pagination/cursor-pagination';
import { ILockDatePagination } from './user-words.interface';

@Injectable()
export class UserWordsService {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {}

  create(data: DeepPartial<UserWord>) {
    const word = this.userWordsRepository.create(data);
    return this.userWordsRepository.save(word);
  }

  findByWord(user: User, word: string) {
    return this.userWordsRepository.findOne({ user, word });
  }

  findById(id: number) {
    return this.userWordsRepository.findOne(id);
  }

  update(id: number, data: DeepPartial<UserWord>) {
    return this.userWordsRepository.update(id, data);
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

  async newWordsCursorList(user: User, first: number, after?: string) {
    const pagination = after
      ? CursorPagination.parseCursor<ILockDatePagination>(after)
      : { offset: -1, lockDate: dayjs().format('YYYY-MM-DD HH:mm:ss') };
    const queryBuilder = this.userWordsRepository
      .createQueryBuilder('a')
      .select()
      .addSelect('a.rememberTimes - a.forgottenTimes', 'exp')
      .orderBy('exp')
      .where('a.updatedDate < :lockDate', { lockDate: pagination.lockDate })
      .andWhere('a.userId = :userId', { userId: user.id });
    return CursorPagination.cursorList<UserWord>(
      queryBuilder,
      first,
      after ? after : CursorPagination.generateCursor(pagination),
    );
  }
}
