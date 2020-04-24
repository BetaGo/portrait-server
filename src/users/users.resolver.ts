import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { DeepPartial } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { ConfigService } from '../config/config.service';
import { ErrorCode } from '../const';
import { generateUpdateResult } from '../utils';
import { UserWordsService } from './user-words/user-words.service';
import { UserGQL } from './users.decorator';
import { UsersService } from './users.service';
import { User } from './models/user.model'
import { User as UserEntity} from './users.entity';
import { UserLoginInput, UserTokenPayload } from './models/user-login.model';

@Resolver(of => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly userWordsService: UserWordsService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async checkUserInfo(userData: DeepPartial<UserEntity>) {
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

  @UseGuards(GQLAuthGuard)
  @Query(returns => User)
  async user(@UserGQL() user: UserEntity): Promise<User> {
    return this.usersService.findOneById(user.id);
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

  @Mutation(returns => UserTokenPayload)
  async userLogin(
    @Args('input') input: UserLoginInput
  ): Promise<UserTokenPayload> {
    const { account, password } = input;
    const parsedPassword = this.authService.parsePassword(password);
    const isTokenRight = await this.authService.consumeLoginToken(
      parsedPassword.token,
    );
    if (!isTokenRight) {
      throw new UnauthorizedException();
    }
    let user: UserEntity | undefined;
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


}
