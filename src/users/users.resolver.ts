import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server-express';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { UserGQL } from './users.decorator';
import { User } from './users.entity';
import { UserWordsService } from './user-words/user-words.service';
import {
  AddUserWordInput,
  UpdateUserWordInput,
  AddUserInput,
  AddUserPayload,
  UserLoginInput,
  UserLoginPayload,
  UpdateUserInput,
  UpdateResult,
} from '../graphql.schema';
import { AuthService } from '../auth/auth.service';
import { DeepPartial } from 'typeorm';
import { generateUpdateResult } from '../utils';
import { ErrorCode } from '../const';

@Resolver('user')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly userWordsService: UserWordsService,
    private readonly authService: AuthService,
  ) {}

  async checkUserInfo(userData: DeepPartial<User>) {
    const isEmailExist = userData.email
      ? await this.usersService.isExist({ email: userData.email })
      : false;
    if (isEmailExist)
      throw new ApolloError('邮箱已被注册', ErrorCode.TIPS_ERROR);

    const isUsernameExist = userData.username
      ? await this.usersService.isExist({
          username: userData.username,
        })
      : false;
    if (isUsernameExist)
      throw new ApolloError('用户名已被注册', ErrorCode.TIPS_ERROR);
  }

  @Mutation('addUser')
  async addUser(@Args('input') input: AddUserInput): Promise<AddUserPayload> {
    const userData = input;
    await this.checkUserInfo(userData);

    const password = await bcrypt.hash(userData.password, 10);
    userData.password = password;

    const user = await this.usersService.create(userData);
    const authToken = await this.authService.sign(user);
    return {
      id: user.id,
      accessToken: authToken.accessToken,
    };
  }

  @UseGuards(GQLAuthGuard)
  @Mutation('updateUser')
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @UserGQL() user: User,
  ): Promise<UpdateResult> {
    const result = await this.usersService.update(user.id, input);
    return generateUpdateResult(result);
  }

  @Query('userLogin')
  async userLogin(
    @Args('input') input: UserLoginInput,
  ): Promise<UserLoginPayload> {
    const { account, password } = input;
    let user: User | undefined;
    if (account.includes('@')) {
      user = await this.usersService.findOne({
        email: account,
      });
    } else {
      user = await this.usersService.findOne({
        username: account,
      });
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.sign(user);
    return token;
  }

  @UseGuards(GQLAuthGuard)
  @Query('user')
  findUser(@UserGQL() user: User) {
    return this.usersService.findOneById(user.id);
  }

  @UseGuards(GQLAuthGuard)
  @Query('userWord')
  findUserWord(
    @UserGQL() user: User,
    @Args('word')
    word: string,
  ) {
    return this.userWordsService.findByWord(user, word);
  }

  @UseGuards(GQLAuthGuard)
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

  @UseGuards(GQLAuthGuard)
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

  @UseGuards(GQLAuthGuard)
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

  @UseGuards(GQLAuthGuard)
  @Mutation('updateUserWord')
  async updateUserWord(
    @UserGQL() user: User,
    @Args('input')
    input: UpdateUserWordInput,
  ): Promise<UpdateResult> {
    const updateResult = await this.userWordsService.update(input.id, {
      ...input,
      user,
    });
    return generateUpdateResult(updateResult);
  }
}
