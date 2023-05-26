import { Field, ObjectType, ID } from "type-graphql";
import { User } from "../User/type.ts";

@ObjectType()
export class ScheduleRaw {
  @Field()
  json: string;

  @Field(() => Schedule)
  schedule: Promise<Schedule>;
}

@ObjectType()
export class Schedule {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => ScheduleRaw)
  content: ScheduleRaw;

  @Field(() => User)
  author: Promise<User>;
}
