import { IsNotEmpty, IsUrl, IsIn } from 'class-validator';

export class ThirdLoginDto {
  @IsIn(['github', 'weibo'])
  type: 'github' | 'weibo';

  @IsNotEmpty()
  @IsUrl()
  redirectUrl: string;
}

export class OAuthCallbackDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  state: string;
}
