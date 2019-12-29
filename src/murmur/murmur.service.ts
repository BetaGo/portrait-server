import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Murmur } from './murmur.entity';

@Injectable()
export class MurmurService {
  constructor(
    @InjectRepository(Murmur)
    private readonly murmurRepository: Repository<Murmur>,
  ) {}

  async create(murmur: DeepPartial<Murmur>): Promise<Murmur> {
    const newMurmur = this.murmurRepository.create(murmur);
    return this.murmurRepository.save(newMurmur);
  }
}
