import { Field, ObjectType, ID } from "type-graphql";
import { Schedule } from "../Schedule/type.ts";

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  tokenVersion: number;

  @Field((type) => [Schedule])
  schedules?: Promise<Schedule[]>;
}
