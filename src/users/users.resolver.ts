import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { UserGQL } from './users.decorator';
import { User } from './users.entity';

@Resolver('user')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('user')
  @UseGuards(GQLAuthGuard)
  findUser(@UserGQL() user: User) {
    return this.usersService.findOneById(user.id);
  }
}
