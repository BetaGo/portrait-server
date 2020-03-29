/* eslint-disable @typescript-eslint/camelcase */
import { IsNotEmpty, IsUrl, IsIn } from 'class-validator';

export class ThirdLoginDto {
  @IsIn(['github', 'weibo'])
  type: 'github' | 'weibo';

  @IsNotEmpty()
  @IsUrl({
    protocols: ['http', 'https', 'chrome-extension'],
    require_tld: false,
  })
  redirectUrl: string;
}

export class OAuthCallbackDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  state: string;
}
