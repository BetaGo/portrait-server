import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';
import * as Url from 'url-parse';

import { User as CurrentUser } from '../users/users.decorator';
import { UserDomain } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { GithubProfile } from './github.strategy';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Render('login')
  login() {
    return {};
  }

  @Get(':type')
  @Redirect('/auth')
  githubAuthPost(
    @Param('type') authType: string,
    @Query('redirect_uri') redirectURI: string = '',
    @Req() request: Request & { session: any },
  ) {
    if (!redirectURI) {
      throw new BadRequestException('redirect_uri can not be empty');
    }
    if (authType === 'github') {
      request.session.redirect_uri = redirectURI;
      return { url: '/auth/github/callback' };
    }
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  @Redirect('/auth')
  async githubAuthCallback(
    @CurrentUser() profile: GithubProfile,
    @Req() request: Request & { session: any },
  ) {
    const redirectURI = request.session.redirect_uri;
    if (!redirectURI) {
      throw new BadRequestException();
    }
    let user = await this.usersService.findOne(profile.id, UserDomain.GITHUB);
    if (!user) {
      user = await this.usersService.create({
        uid: profile.id,
        displayName: profile.displayName,
        username: profile.username,
        avatar: _.get(profile, 'photos[0].value', ''),
        email: _.get(profile, 'emails[0].value', ''),
        domain: UserDomain.GITHUB,
      });
    }
    const token = await this.authService.login(user);
    const parsed = new Url(redirectURI);
    parsed.set('query', { token: token.access_token });
    return {
      url: parsed.toString(),
    };
    // return {
    //   result: JSON.stringify({ success: true }),
    //   token: JSON.stringify(token),
    //   user: JSON.stringify(user),
    // };
  }
}
