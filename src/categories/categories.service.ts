import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(userId?: number): Promise<Category[]> {
    if (userId !== undefined) {
      return this.categoryRepository.find();
    }
    return this.categoryRepository.find({
      userId,
    });
  }

  create(category: DeepPartial<Category>): Promise<Category> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  findOneById(id: number): Promise<Category | undefined> {
    return this.categoryRepository.findOne(id);
  }
}
