import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActionsService } from './actions.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateActionDto } from './dto/create-action';
import { UserGql } from '../users/users.decorator';
import { User } from '../users/users.entity';
import { TagsService } from '../tags/tags.service';
import { Action } from './actions.entity';

@Resolver('Action')
export class ActionsResolver {
  constructor(
    private readonly actionsService: ActionsService,
    private readonly tagsService: TagsService,
  ) {}

  @Mutation('createAction')
  @UseGuards(GqlAuthGuard)
  async createAction(
    @Args('createActionInput') action: CreateActionDto,
    @UserGql() user: User,
  ) {
    let newAction = new Action();
    newAction = Object.assign(newAction, action);
    newAction.tags = await this.tagsService.findByIds(action.tagIds);
    newAction.user = user;
    const result = await this.actionsService.create(newAction);
    return this.actionsService.findOneWithRelation(result.id);
  }

  @Query('action')
  @UseGuards(GqlAuthGuard)
  async getAction(@Args('id') id: number) {
    return this.actionsService.findOneWithRelation(id);
  }

  @Query('getActions')
  @UseGuards(GqlAuthGuard)
  async findAll() {
    return this.actionsService.findAll();
  }
}
