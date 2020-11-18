import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { DeepPartial } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { ConfigService } from '../config/config.service';
import { ErrorCode } from '../const';
// import {
//   AddUserInput,
//   AddUserPayload,
//   AddUserWordInput,
//   RefreshTokenInput,
//   RefreshTokenPayload,
//   UpdateResult,
//   UpdateUserInput,
//   UpdateUserWordInput,
//   UserLoginInput,
//   UserLoginPayload,
//   UserWord as UserWordPayload,
//   User as UserPayload,
//   AddUserWordPayload,
//   UserWordsResultCursor,
//   NewWordsResultCursor,
//   LoginTokenPayload,
// } from '../graphql.schema';
import { generateUpdateResult } from '../utils';
import { UserWordsService } from './user-words/user-words.service';
import { UserGQL } from './users.decorator';
import { User } from './users.entity';
import { UsersService } from './users.service';

import * as userModels from './models/user.model';
import * as appModels from '../app.model';
import * as userWordsModels from './models/user-words.model';

import { Paginated } from '../common/pagination/cursor-pagination';

@Resolver((of) => userModels.User)
// @Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly userWordsService: UserWordsService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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

  @Mutation((returns) => userModels.AuthorizationToken)
  async addUser(
    @Args('input') input: userModels.AddUserInput,
  ): Promise<userModels.AuthorizationToken> {
    const userData = input;
    await this.checkUserInfo(userData);
    const parsedPassword = this.authService.parsePassword(userData.password);
    const password = await bcrypt.hash(parsedPassword.text, 10);
    userData.password = password;

    const user = await this.usersService.create(userData);
    const authToken = await this.authService.sign(user);
    return authToken;
  }

  @UseGuards(GQLAuthGuard)
  @Mutation((returns) => appModels.UpdateResult)
  async updateUser(
    @Args('input') input: userModels.UpdateUserInput,
    @UserGQL() user: User,
  ): Promise<appModels.UpdateResult> {
    if (input.password) {
      const parsedPassword = this.authService.parsePassword(input.password);
      input.password = await bcrypt.hash(parsedPassword.text, 10);
    }
    const result = await this.usersService.update(user.id, input);
    return generateUpdateResult(result);
  }

  @Query((returns) => userModels.AuthorizationToken)
  async userLogin(
    @Args('input') input: userModels.UserLoginInput,
  ): Promise<userModels.AuthorizationToken> {
    const { account, password } = input;
    const parsedPassword = this.authService.parsePassword(password);
    const isTokenRight = await this.authService.consumeLoginToken(
      parsedPassword.token,
    );
    if (!isTokenRight) {
      throw new UnauthorizedException();
    }
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
    const isMatch = await bcrypt.compare(parsedPassword.text, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.sign(user);
    return tokens;
  }

  @Query((returns) => userModels.EncryptTokenPayload)
  async encryptToken(): Promise<userModels.EncryptTokenPayload> {
    const token = await this.authService.createLoginToken();
    return {
      token,
      publicKey: this.configService
        .get('LOGIN_PUBLIC_RSA_KEY')
        .export({
          format: 'pem',
          type: 'spki',
        })
        .toString(),
    };
  }

  @Query((returns) => userModels.AuthorizationToken)
  async refreshToken(
    @Args('input') input: userModels.RefreshTokenInput,
  ): Promise<userModels.AuthorizationToken> {
    const accessTokenPayload = this.authService.parseAccessToken(
      input.accessToken,
    );
    const user = await this.usersService.findOneById(accessTokenPayload.sub);

    try {
      const token = await this.authService.consumeRefreshToken(
        input.accessToken,
        input.refreshToken,
        user,
      );
      return token;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(GQLAuthGuard)
  @Query((returns) => userModels.User, { name: 'user' })
  findUser(@UserGQL() user: User): userModels.User {
    return user;
  }

  @UseGuards(GQLAuthGuard)
  @Query((returns) => userWordsModels.UserWord, {
    name: 'userWord',
    nullable: true,
  })
  findUserWord(
    @UserGQL() user: User,
    @Args('word')
    word: string,
  ): Promise<userWordsModels.UserWord> {
    return this.userWordsService.findByWord(user, word);
  }

  @UseGuards(GQLAuthGuard)
  @Query((returns) => userWordsModels.UserWordsPaginated, {
    name: 'allUserWords',
  })
  findUserWords(
    @UserGQL() user: User,
    @Args('first', { type: () => Int })
    first: number,
    @Args('after', { nullable: true })
    after?: string,
  ): Promise<userWordsModels.UserWordsPaginated> {
    return this.userWordsService.allWordsCursorList(user, first, after);
  }

  @UseGuards(GQLAuthGuard)
  @Query((returns) => userWordsModels.UserWordsPaginated, {
    name: 'allNewWords',
  })
  findAllNewWords(
    @UserGQL() user: User,
    @Args('first', { type: () => Int })
    first: number,
    @Args('after', { nullable: true })
    after?: string,
  ): Promise<userWordsModels.UserWordsPaginated> {
    return this.userWordsService.newWordsCursorList(user, first, after);
  }

  @UseGuards(GQLAuthGuard)
  @Mutation((returns) => userWordsModels.AddUserWordPayload)
  addUserWord(
    @UserGQL() user: User,
    @Args('input')
    input: userWordsModels.AddUserWordInput,
  ): Promise<userWordsModels.AddUserWordPayload> {
    return this.userWordsService.createOrUpdate({
      ...input,
      user,
    });
  }

  @UseGuards(GQLAuthGuard)
  @Mutation((returns) => appModels.UpdateResult)
  async updateUserWord(
    @UserGQL() user: User,
    @Args('input')
    input: userWordsModels.UpdateUserWordInput,
  ): Promise<appModels.UpdateResult> {
    const updateResult = await this.userWordsService.update(input.id, {
      ...input,
      user,
    });
    return generateUpdateResult(updateResult);
  }
}
