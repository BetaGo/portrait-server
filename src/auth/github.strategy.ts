import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: 'b60fa8978d8f232f199b',
      clientSecret: '2e988e56972b949bee8e1e9ed818cf00dd686dbb',
      callbackURL: 'http://127.0.0.1:3000/auth/github/callback',
      scope: ['user:email'],
      failureRedirect: '/auth',
    });
  }

  async validate(accessToken: any, refreshToken: any, profile: any) {
    const user = {
      accessToken,
      refreshToken,
      profile,
    };
    return user;
  }
}
