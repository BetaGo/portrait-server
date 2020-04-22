/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import crypto from 'crypto';
import qs from 'querystring';
import * as redis from 'redis';
import { v4 as uuidV4 } from 'uuid';

import { ConfigService } from '../config/config.service';
import { User } from '../users/users.entity';
import {
  IAccessTokenPayload,
  IGithubUser,
  IPassword,
  IWeiboUser,
} from './auth.interface';

@Injectable()
export class AuthService {
  public redis: redis.RedisClient;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.redis = redis.createClient();
  }

  parsePassword(encryptedPassword: string): IPassword {
    const privateKey = this.configService.get('LOGIN_PRIVATE_RSA_KEY');
    const parsedString = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedPassword, 'base64'),
    );
    const password = JSON.parse(parsedString.toString());
    return password;
  }

  parseAccessToken(accessToken: string): IAccessTokenPayload {
    return this.jwtService.decode(accessToken) as IAccessTokenPayload;
  }

  async createLoginToken(): Promise<string> {
    const token = uuidV4();
    await new Promise<string>((resolve, reject) => {
      this.redis.set(token, '', (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      this.redis.pexpire(
        token,
        this.configService.get('LOGIN_TOKEN_EXPIRES_IN'),
        (err) => {
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
      this.redis.set(accessToken, refreshToken, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      this.redis.pexpire(
        accessToken,
        this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        (err) => {
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
        this.redis.del(accessToken, (err) => {
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

  async getUserInfoWeibo(code: string, state: string): Promise<IWeiboUser> {
    const clientId = this.configService.get('WEIBO_CLIENT_ID');
    const clientSecret = this.configService.get('WEIBO_CLIENT_SECRET');
    const redirectUri = this.configService.get('WEIBO_CALLBACK_URL');
    const res = await axios.post(
      'https://api.weibo.com/oauth2/access_token?' +
        qs.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          state,
        }),
    );

    const accessToken = res.data.access_token;
    const uid = res.data.uid;
    if (!accessToken) throw new Error('weibo 获取 access_token 失败');
    const userInfoRes = await axios.get<IWeiboUser>(
      'https://api.weibo.com/2/users/show.json',
      {
        params: {
          uid,
          access_token: accessToken,
        },
      },
    );
    return userInfoRes.data;
  }
}
