import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './actions.entity';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}

  findAll(): Promise<Action[]> {
    return this.actionRepository.find();
  }

  create(action: DeepPartial<Action>): Promise<Action> {
    const newAction = this.actionRepository.create(action);
    return this.actionRepository.save(newAction);
  }
}
