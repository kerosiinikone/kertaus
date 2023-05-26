import { Field, ObjectType, ID } from "type-graphql";
import { User } from "../User/type.ts";

@ObjectType()
export class Schedule {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field((type) => User)
  author: Promise<User>;
}
