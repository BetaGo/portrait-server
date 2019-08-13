import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './records.entity';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  findAll(): Promise<Record[]> {
    return this.recordRepository.find({
      relations: ['category', 'tags'],
    });
  }

  findOne(id: number): Promise<Record | undefined> {
    return this.recordRepository.findOne(id);
  }

  findOneWithRelation(id: number): Promise<Record | undefined> {
    return this.recordRepository.findOne(id, {
      relations: ['category', 'tags'],
    });
  }

  async create(action: DeepPartial<Record>): Promise<Record> {
    const newAction = this.recordRepository.create(action);
    return this.recordRepository.save(newAction);
  }
}
