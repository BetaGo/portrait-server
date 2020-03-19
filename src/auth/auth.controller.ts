/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';
import qs from 'querystring';
import Url from 'url-parse';

import { ConfigService } from '../config/config.service';
import { ThirdLoginType } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { OAuthCallbackDto, ThirdLoginDto } from './auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('callback')
  callback(@Req() req: Request) {
    return req.header('Host');
  }

  @Get('/thirdLogin')
  @Redirect('/')
  thirdLogin(@Query() data: ThirdLoginDto) {
    const { type, redirectUrl } = data;

    const state = Buffer.from(redirectUrl).toString('base64');
    switch (type) {
      case 'github':
        return {
          url:
            'https://github.com/login/oauth/authorize?' +
            qs.stringify({
              state,
              client_id: this.configService.get('GITHUB_CLIENT_ID'),
              scope: 'read:user',
              redirect_uri: this.configService.get('GITHUB_CALLBACK_URL'),
            }),
        };
      default:
        break;
    }
  }

  @Get('/github')
  @Redirect('/')
  async githubCallback(@Query() data: OAuthCallbackDto) {
    const { code, state } = data;
    const userInfo = await this.authService.getUserInfoGithub(code, state);
    let user = await this.usersService.findOne({
      thirdLoginType: ThirdLoginType.GITHUB,
      thirdLoginId: String(userInfo.id),
    });
    if (!user) {
      user = await this.usersService.create({
        thirdLoginId: String(userInfo.id),
        thirdLoginType: ThirdLoginType.GITHUB,
        avatar: userInfo.avatar_url,
        displayName: userInfo.name,
        email: userInfo.email || '',
      });
    }
    if (userInfo.email && !user.email) {
      await this.usersService.update(user.id, {
        email: userInfo.email,
      });
    }
    const token = await this.authService.sign(user);
    const s = Buffer.from(state, 'base64').toString();
    const url = new Url(s);
    url.set('query', {
      ...url.query,
      ...token,
    });
    return {
      url: url.toString(),
    };
  }
}
