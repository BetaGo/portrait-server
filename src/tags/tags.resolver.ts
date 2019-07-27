import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Tag } from '../graphql.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver('Tag')
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query('getTags')
  @UseGuards(GqlAuthGuard)
  async getTags() {
    return this.tagsService.findAll();
  }

  @Query('tag')
  @UseGuards(GqlAuthGuard)
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Tag | undefined> {
    return this.tagsService.findOneById(id);
  }

  @Mutation('createTag')
  @UseGuards(GqlAuthGuard)
  async create(
    @Args('createTagInput')
    tag: CreateTagDto,
  ): Promise<Tag> {
    const existTag = await this.tagsService.findOneByName(tag.name);
    if (existTag) {
      return existTag;
    }
    return this.tagsService.create(tag);
  }
}
