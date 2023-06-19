import { Field, ObjectType, ID, ArgsType } from "type-graphql";
import { User } from "../User/type.ts";
import { CodeType, Intensities } from "../../../../shared/index.ts";
import type { ScheduleSchema } from "../../../../shared/index.ts";
import { registerEnumType } from "type-graphql";

registerEnumType(Intensities, {
  name: "Intensities",
});
registerEnumType(CodeType, {
  name: "CodeType",
});

@ObjectType()
export class ScheduleSchemaGraph {
  @Field(() => [String])
  aiheet: string[];

  @Field(() => String)
  teoriat: string;

  @Field()
  tehtavananto: number;

  @Field()
  kesto: number;
}

@ObjectType()
export class Schedule {
  @Field(() => ID)
  id?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => [ScheduleSchemaGraph])
  content: ScheduleSchema[];

  @Field(() => User, { nullable: true })
  author?: Promise<User>;

  @Field(() => String, { nullable: true })
  authorId?: string;
}

@ArgsType()
export class ScheduleInput {
  @Field(() => String, { nullable: false })
  subject: string;

  @Field(() => String, { nullable: false })
  timePeriod: string;

  @Field(() => Intensities, { nullable: false })
  intensity: Intensities;

  @Field(() => CodeType, { nullable: false })
  subjectType: CodeType;

  @Field(() => [String], { nullable: true })
  courses: string[];

  @Field(() => String, { nullable: true })
  name?: string;
}

@ArgsType()
export class ScheduleQueryParams {
  @Field(() => Number, { nullable: false })
  take: number;

  @Field(() => Number, { nullable: false })
  offset: number;
}
