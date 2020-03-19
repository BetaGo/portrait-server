import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as redis from 'redis';

import { ConfigService } from '../config/config.service';
import { User } from '../users/users.entity';
import { IGithubUser, IAccessTokenPayload } from './auth.interface';

@Injectable()
export class AuthService {
  public redis: redis.RedisClient;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.redis = redis.createClient();
  }

  parseAccessToken(accessToken: string): IAccessTokenPayload {
    return this.jwtService.decode(accessToken) as IAccessTokenPayload;
  }

  async refreshToken(accessToken: string, refreshToken: string, user: User) {
    const t = await new Promise<string>((resolve, reject) => {
      this.redis.get(accessToken, (err, reply) => {
        if (err) reject(err);
        resolve(reply)
      });
    } )
    if (t && t === refreshToken) {
      return this.sign(user);
    } else {
      throw new Error('token 无效');
    }
  }

  createRefreshToken(accessToken: string) {
    const refreshToken = this.jwtService.sign({}, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN')
    });
    this.redis.SET(accessToken, refreshToken);
    this.redis.PEXPIRE(accessToken, this.configService.get('REFRESH_TOKEN_EXPIRES_IN'));
    return refreshToken;
  }

  async sign(user: User) {
    const payload: IAccessTokenPayload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.createRefreshToken(accessToken);
    return {
      accessToken,
      refreshToken
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
