import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './actions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}

  findAll(): Promise<Action[]> {
    return this.actionRepository.find();
  }
}
