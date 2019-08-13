import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as _ from 'lodash';
import { UserGQL } from '../users/users.decorator';
import { User } from '../users/users.entity';

import { GQLAuthGuard } from '../auth/graphql-auth-guard.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category';
import { MoreThan, Like, Any } from 'typeorm';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query('getCategories')
  @UseGuards(GQLAuthGuard)
  async getCategories(
    @UserGQL() user: User,
    @Args('keyword') keyword: string,
    @Args('pageSize') pageSize: number = 10,
    @Args('cursor') cursor: number = 0,
  ) {
    const whereCondition = {
      userId: user.id,
      id: MoreThan(cursor),
      name: Like(`${keyword}%`),
    };
    if (!keyword) {
      delete whereCondition.name;
    }
    return this.categoriesService.findAll({
      where: whereCondition,
      take: pageSize,
    });
  }

  @Query('category')
  @UseGuards(GQLAuthGuard)
  async findOneById(@Args('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOneById(id);
  }

  @Mutation('createCategory')
  @UseGuards(GQLAuthGuard)
  async createCategory(
    @Args('createCategoryInput') category: CreateCategoryDto,
    @UserGQL() user: User,
  ) {
    return this.categoriesService.create({ ...category, userId: user.id });
  }
}
