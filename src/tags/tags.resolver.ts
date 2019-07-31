import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserGql } from '../users/users.decorator';
import { User } from '../users/users.entity';

import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Tag } from '../graphql.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

@Resolver('Tag')
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query('getTags')
  @UseGuards(GqlAuthGuard)
  async getTags(@UserGql() user: User) {
    return this.tagsService.findAll(user.id);
  }

  @Query('tag')
  @UseGuards(GqlAuthGuard)
  async findOneById(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<Tag | undefined> {
    return this.tagsService.findOneById(id);
  }

  @Mutation('createTag')
  @UseGuards(GqlAuthGuard)
  async create(
    @Args('createTagInput') tag: CreateTagDto,
    @UserGql() user: User,
  ): Promise<Tag> {
    const existTag = await this.tagsService.findOneByName(tag.name, user.id);
    if (existTag) {
      return existTag;
    }
    return this.tagsService.create({ ...tag, userId: user.id });
  }
}
