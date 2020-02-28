import Joi from '@hapi/joi';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import _ from 'lodash';
import Url from 'url-parse';

import { User as CurrentUser } from '../users/users.decorator';
import { UserDomain } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { GithubProfile } from './github.strategy';
import { ThirdLoginDto } from './auth-dto';
import { ConfigService } from '../config/config.service';

const sessionSchema = Joi.object()
  .keys({
    redirect_uri: Joi.string()
      .uri({
        scheme: /https?/,
      })
      .allow(''),
  })
  .options({
    stripUnknown: true,
  });

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get('callback')
  callback(@Req() req: Request) {
    return req.header('Host');
  }

  @Post('/')
  @Redirect('/')
  thirdLogin(
    @Body() body: ThirdLoginDto
  ) {
    const {
      type,
      redirectUrl,
    } = body;

    const state = Buffer.from(redirectUrl).toString('base64');
    switch (type) {
      case 'github':
        return {
          url: `https://github.com/login/oauth/authorize?state=${state}&client_id=${this.configService.get('GITHUB_CLIENT_ID')}&scope=user:email`,
        }
        break;
    
      default:
        break;
    }
  }

  @Get(':type')
  @Redirect('/auth')
  githubAuthPost(
    @Param('type') authType: string,
    @Query('redirect_uri') redirectURI = '',
    @Req() request: Request & { session: any },
  ) {
    request.session.redirect_uri = redirectURI;
    const { error } = sessionSchema.validate(request.session);
    if (error) {
      throw new BadRequestException(error.message);
    }
    if (authType === 'github') {
      return { url: '/auth/github/callback' };
    }
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  @Redirect('/auth/callback')
  async githubAuthCallback(
    @CurrentUser() profile: GithubProfile,
    @Req() request: Request & { session: any },
  ) {
    const { error } = sessionSchema.validate(request.session);
    if (error) {
      throw new BadRequestException(error.message);
    }
    const redirectURI = request.session.redirect_uri;
    let user = await this.usersService.findOneInThirdLogin(
      profile.id,
      UserDomain.GITHUB,
    );
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
    const token = await this.authService.sign(user);
    if (redirectURI) {
      const parsed = new Url(redirectURI);
      parsed.set('query', { token: token.accessToken });
      return {
        url: parsed.toString(),
      };
    } else {
      const baseUrl = `${request.protocol}://${request.header(
        'Host',
      )}/auth/callback`;
      const parsed = new Url(baseUrl);
      parsed.set('query', { token: token.accessToken });
      return {
        url: parsed.toString(),
      };
    }
  }
}
