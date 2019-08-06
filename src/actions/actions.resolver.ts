import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ActionsService } from './actions.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateActionDto } from './dto/create-action';
import { UserGql } from '../users/users.decorator';
import { User } from '../users/users.entity';

@Resolver('Action')
export class ActionsResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Mutation('createAction')
  @UseGuards(GqlAuthGuard)
  async createAction(
    @Args('createActionInput') action: CreateActionDto,
    @UserGql() user: User,
  ) {
    const result = await this.actionsService.create({ ...action, user });
    return this.actionsService.findOneWithRelation(result.id);
  }

  @Query('action')
  @UseGuards(GqlAuthGuard)
  async getAction(@Args('id') id: number) {
    return this.actionsService.findOne(id);
  }
}
