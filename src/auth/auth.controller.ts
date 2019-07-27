import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post()
  basicAuth() {
    return 'basic auth';
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  githubAuth() {
    return 'github auth';
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  githubAuthCallback(@Request() req: any) {
    return req.user;
  }
}
