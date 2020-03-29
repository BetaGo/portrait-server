import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { DeepPartial } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { ConfigService } from '../config/config.service';
import { ErrorCode } from '../const';
import {
  AddUserInput,
  AddUserPayload,
  AddUserWordInput,
  RefreshTokenInput,
  RefreshTokenPayload,
  UpdateResult,
  UpdateUserInput,
  UpdateUserWordInput,
  UserLoginInput,
  UserLoginPayload,
  UserWord as UserWordPayload,
  User as UserPayload,
  AddUserWordPayload,
  UserWordsResultCursor,
  NewWordsResultCursor,
  LoginTokenPayload,
} from '../graphql.schema';
import { generateUpdateResult } from '../utils';
import { UserWordsService } from './user-words/user-words.service';
import { UserGQL } from './users.decorator';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Resolver('user')
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

  @Mutation('addUser')
  async addUser(@Args('input') input: AddUserInput): Promise<AddUserPayload> {
    const userData = input;
    await this.checkUserInfo(userData);
    const parsedPassword = this.authService.parsePassword(userData.password);
    const password = await bcrypt.hash(parsedPassword.text, 10);
    userData.password = password;

    const user = await this.usersService.create(userData);
    const authToken = await this.authService.sign(user);
    return {
      id: user.id,
      ...authToken,
    };
  }

  @UseGuards(GQLAuthGuard)
  @Mutation('updateUser')
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @UserGQL() user: User,
  ): Promise<UpdateResult> {
    if (input.password) {
      const parsedPassword = this.authService.parsePassword(input.password);
      input.password = await bcrypt.hash(parsedPassword.text, 10);
    }
    const result = await this.usersService.update(user.id, input);
    return generateUpdateResult(result);
  }

  @Query('userLogin')
  async userLogin(
    @Args('input') input: UserLoginInput,
  ): Promise<UserLoginPayload> {
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
    const isMatch = bcrypt.compare(parsedPassword.text, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.sign(user);
    return tokens;
  }

  @Query('loginToken')
  async loginToken(): Promise<LoginTokenPayload> {
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

  @Query('refreshToken')
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<RefreshTokenPayload> {
    const accessTokenPayload = this.authService.parseAccessToken(
      input.accessToken,
    );
    const user = await this.usersService.findOneById(accessTokenPayload.sub);
    return this.authService.consumeRefreshToken(
      input.accessToken,
      input.refreshToken,
      user,
    );
  }

  @UseGuards(GQLAuthGuard)
  @Query('user')
  findUser(@UserGQL() user: User): Promise<UserPayload> {
    return this.usersService.findOneById(user.id);
  }

  @UseGuards(GQLAuthGuard)
  @Query('userWord')
  findUserWord(
    @UserGQL() user: User,
    @Args('word')
    word: string,
  ): Promise<UserWordPayload> {
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
  ): Promise<UserWordsResultCursor> {
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
  ): Promise<NewWordsResultCursor> {
    return this.userWordsService.newWordsCursorList(user, first, after);
  }

  @UseGuards(GQLAuthGuard)
  @Mutation('addUserWord')
  addUserWord(
    @UserGQL() user: User,
    @Args('input')
    input: AddUserWordInput,
  ): Promise<AddUserWordPayload> {
    return this.userWordsService.createOrUpdate({
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
