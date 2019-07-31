import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserGql } from '../users/users.decorator';
import { User } from '../users/users.entity';

import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query('getCategories')
  @UseGuards(GqlAuthGuard)
  async getCategories(@UserGql() user: User) {
    return this.categoriesService.findAll(user.id);
  }

  @Query('category')
  @UseGuards(GqlAuthGuard)
  async findOneById(@Args('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOneById(id);
  }

  @Mutation('createCategory')
  @UseGuards(GqlAuthGuard)
  async createCategory(
    @Args('createCategoryInput') category: CreateCategoryDto,
    @UserGql() user: User,
  ) {
    return this.categoriesService.create({ ...category, userId: user.id });
  }
}
