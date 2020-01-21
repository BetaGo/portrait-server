import { InjectRepository } from '@nestjs/typeorm';

import { En2CnWord } from './en2cn-words.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class En2CnWordsService {
  constructor(
    @InjectRepository(En2CnWord)
    private readonly en2CnWordRepository: Repository<En2CnWord>,
  ) {}

  find(word: string) {
    return this.en2CnWordRepository.findOne({ word });
  }

  update(word: string, translation: string) {
    return this.en2CnWordRepository.update({ word }, { translation });
  }

  create(word: string, translation: string) {
    const wordIns = this.en2CnWordRepository.create({
      word,
      translation,
    });
    return this.en2CnWordRepository.save(wordIns);
  }
}
