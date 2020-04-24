import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field({
    nullable: true,
  })
  thirdLoginId: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  ThirdLoginType?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(type => Date)
  createdDate: Date;
}
