/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as redis from 'redis';
import { v4 as uuidV4 } from 'uuid';

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

  async createLoginToken(): Promise<string> {
    const token = uuidV4();
    await new Promise<string>((resolve, reject) => {
      this.redis.set(token, '', err => {
        if (err) reject(err);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      this.redis.pexpire(
        token,
        this.configService.get('LOGIN_TOKEN_EXPIRES_IN'),
        err => {
          if (err) reject(err);
          resolve();
        },
      );
    });
    return token;
  }

  async consumeLoginToken(token: string): Promise<boolean> {
    const res = await new Promise<number>((resolve, reject) => {
      this.redis.exists(token, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
    if (res === 1) {
      await new Promise((resolve, reject) => {
        this.redis.del(token, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      });
      return true;
    }
    return false;
  }

  async createRefreshToken(accessToken: string) {
    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );
    await new Promise((resolve, reject) => {
      this.redis.set(accessToken, refreshToken, err => {
        if (err) reject(err);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      this.redis.pexpire(
        accessToken,
        this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        err => {
          if (err) reject(err);
          resolve();
        },
      );
    });
    return refreshToken;
  }

  async consumeRefreshToken(
    accessToken: string,
    refreshToken: string,
    user: User,
  ) {
    const t = await new Promise<string>((resolve, reject) => {
      this.redis.get(accessToken, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
    if (t && t === refreshToken) {
      await new Promise((resolve, reject) => {
        this.redis.del(accessToken, err => {
          if (err) reject(err);
          resolve();
        });
      });
      return this.sign(user);
    } else {
      throw new Error('token 无效');
    }
  }

  async sign(user: User) {
    const payload: IAccessTokenPayload = {
      username: user.username,
      sub: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(accessToken);
    return {
      accessToken,
      refreshToken,
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
