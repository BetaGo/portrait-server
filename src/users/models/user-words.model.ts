import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';

import { Paginated } from '../../common/pagination/cursor-pagination';

@ObjectType()
export class UserWord {
  @Field()
  word: string;

  @Field()
  translation: string;

  @Field()
  example: string;

  @Field((type) => Int)
  forgottenTimes: number;

  @Field((type) => Int)
  rememberTimes: number;

  @Field((type) => Int)
  exp: number;

  @Field((type) => Int, { description: '0: false; 1: true' })
  isKnown: number;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;
}

@InputType()
export class AddUserWordInput {
  @Field()
  word: string;

  @Field({ nullable: true })
  translation?: string;

  @Field({ nullable: true })
  example?: string;
}

@ObjectType()
export class AddUserWordPayload extends UserWord {
  @Field((type) => Int)
  id: number;
}

@InputType()
export class UpdateUserWordInput extends PartialType(AddUserWordInput) {
  @Field((type) => Int)
  id: number;
}

@ObjectType()
export class UserWordsPaginated extends Paginated(UserWord) {}
