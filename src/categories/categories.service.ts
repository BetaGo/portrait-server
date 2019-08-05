import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';

import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(option: FindManyOptions<Category>): Promise<Category[]> {
    return this.categoryRepository.find(option);
  }

  create(category: DeepPartial<Category>): Promise<Category> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  findOneById(id: number): Promise<Category | undefined> {
    return this.categoryRepository.findOne(id);
  }
}
