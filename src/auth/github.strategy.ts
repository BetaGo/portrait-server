import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';

export interface GithubProfile {
  id: string;
  displayName: string;
  username: string;
  emails: Array<{
    value: string;
  }>;
  photos: Array<{
    value: string;
  }>;
  provider: string;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL: config.get('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
      failureRedirect: '/auth',
    });
  }

  /**
   * return 的值会挂载到 req.user 上
   * @param accessToken
   * @param refreshToken
   * @param profile
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
  ) {
    return profile;
  }
}
