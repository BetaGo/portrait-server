import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';

import { User as CurrentUser } from '../users/user.decorator';
import { UserDomain } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { GithubProfile } from './github.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post()
  basicAuth() {
    return 'basic auth';
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  githubAuthPost() {
    return 'github auth';
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  @Render('auth-callback')
  async githubAuthCallback(@CurrentUser() profile: GithubProfile) {
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
    return {
      token: JSON.stringify(token),
      user: JSON.stringify(user),
    };
  }
}
