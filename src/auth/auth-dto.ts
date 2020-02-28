import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class ThirdLoginDto {
  type: 'github' | 'weibo';

  @IsNotEmpty()
  @IsUrl()
  redirectUrl: string;
}