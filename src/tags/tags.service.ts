import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as _ from 'lodash';

import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  findAll(userId?: number): Promise<Tag[]> {
    if (userId !== undefined) {
      return this.tagRepository.find({
        userId,
      });
    }
    return this.tagRepository.find();
  }

  create(tag: DeepPartial<Tag>): Promise<Tag> {
    const newTag = this.tagRepository.create(tag);
    return this.tagRepository.save(newTag);
  }

  findOneById(id: number): Promise<Tag | undefined> {
    return this.tagRepository.findOne(id);
  }

  findOneByName(name: string, userId?: number): Promise<Tag | undefined> {
    return this.tagRepository.findOne({
      name,
      userId,
    });
  }
}
