import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from '../auth/graphql-auth-guard.service';

@Resolver('user')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('user')
  @UseGuards(GQLAuthGuard)
  findUser(@Args('id') id: number) {
    return this.usersService.findOneById(id);
  }
}
