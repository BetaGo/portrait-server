import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { UserGQL } from '../users/users.decorator';
import { User } from '../users/users.entity';
import { MurmurService } from './murmur.service';

@Resolver('murmur')
export class MurmurResolver {
  constructor(private readonly murmurService: MurmurService) {}

  @Mutation('createMurmur')
  @UseGuards(GQLAuthGuard)
  async create(
    @Args('text')
    text: string,

    @UserGQL()
    user: User,
  ) {
    const murmur = await this.murmurService.create({
      text,
      user,
    });
    return murmur;
  }
}
