import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { UserGQL } from './users.decorator';
import { User } from './users.entity';
import { UserWordsService } from './user-words/user-words.service';
import {
  AddUserWordInput,
  UpdateUserWordInput,
  UpdateUserWordPayload,
} from '../graphql.schema';

@Resolver('user')
@UseGuards(GQLAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly userWordsService: UserWordsService,
  ) {}

  @Query('user')
  findUser(@UserGQL() user: User) {
    return this.usersService.findOneById(user.id);
  }

  @Query('userWord')
  findUserWord(
    @UserGQL() user: User,
    @Args('word')
    word: string,
  ) {
    return this.userWordsService.findByWord(user, word);
  }

  @Query('allUserWords')
  findUserWords(
    @UserGQL() user: User,
    @Args('first')
    first: number,
    @Args('after')
    after?: string,
  ) {
    return this.userWordsService.allWordsCursorList(user, first, after);
  }

  @Query('allNewWords')
  findAllNewWords(
    @UserGQL() user: User,
    @Args('first')
    first: number,
    @Args('after')
    after?: string,
  ) {
    return this.userWordsService.newWordsCursorList(user, first, after);
  }

  @Mutation('addUserWord')
  addUserWord(
    @UserGQL() user: User,
    @Args('input')
    input: AddUserWordInput,
  ) {
    return this.userWordsService.create({
      ...input,
      user,
    });
  }

  @Mutation('updateUserWord')
  async updateUserWord(
    @UserGQL() user: User,
    @Args('input')
    input: UpdateUserWordInput,
  ): Promise<UpdateUserWordPayload> {
    const updateResult = await this.userWordsService.update(input.id, {
      ...input,
      user,
    });

    if (updateResult.affected === 1) {
      return {
        success: true,
      };
    } else if (updateResult.affected === 0) {
      return {
        success: false,
        message: '数据不存在',
      };
    }
    return {
      success: false,
      message: '更新失败',
    };
  }
}
