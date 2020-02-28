/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import { IGithubUser } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sign(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getUserInfoGithub(code: string, state: string): Promise<IGithubUser> {
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get('GITHUB_CLIENT_SECRET');
    const redirectUri = this.configService.get('GITHUB_CALLBACK_URL');

    const res = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        state,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const accessToken = res.data.access_token;
    if (!accessToken) throw new Error('github 获取 access_token 失败');
    const userInfoRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: 'token ' + accessToken,
      },
    });
    return userInfoRes.data;
  }
}
