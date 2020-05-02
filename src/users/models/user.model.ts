import { Field, Int, ObjectType, InputType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  thirdLoginId: string;

  @Field()
  thirdLoginType: string;

  @Field()
  username: string;

  @Field()
  displayName: string;

  @Field()
  email: string;

  @Field()
  avatar: string;

  @Field()
  phone: string;
}

@InputType()
export class AddUserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  phone: string;
}

@InputType()
export class UpdateUserInput extends OmitType(AddUserInput, ['username']) {}

@InputType()
export class UserLoginInput {
  @Field()
  account: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthorizationToken {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class EncryptTokenPayload {
  @Field()
  token: string;

  @Field()
  publicKey: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
