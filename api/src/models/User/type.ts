import { Field, ObjectType, ID } from "type-graphql";
import { Schedule } from "../Schedule/type.js";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  tokenVersion: number;

  @Field((type) => [Schedule], { nullable: true })
  schedules?: Promise<Schedule[]>;
}

@ObjectType()
export class LogoutType {
  @Field()
  success: boolean;
}
