import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class UserLoginInput {
  @Field()
  account: string;

  @Field()
  password: string;
}

@ObjectType()
export class UserTokenPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

// type UserLoginPayload {
//   accessToken: String!
//   refreshToken: String!
// }