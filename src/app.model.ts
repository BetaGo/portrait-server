import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
