import { Field, ObjectType, ID, ArgsType, InputType } from "type-graphql";
import { User } from "../User/type.ts";
import { CodeType, CourseType, Intensities } from "../../../../shared/index.ts";
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

  @Field(() => [String])
  teoriat: string[];

  @Field()
  tehtavananto: string;

  @Field()
  kesto: number;
}

@ObjectType()
export class Schedule {
  @Field(() => ID)
  id?: string;

  @Field()
  name?: string;

  @Field(() => [ScheduleSchemaGraph])
  content: ScheduleSchema[];

  @Field(() => User)
  author?: Promise<User>;
}

@InputType()
class CourseTypeGraph {
  @Field()
  name: string;
}

@InputType()
export class ScheduleInput {
  @Field(() => String, { nullable: false })
  subject: string;

  @Field(() => String, { nullable: false })
  timePeriod: string;

  @Field(() => Intensities, { nullable: false })
  intensity: Intensities;

  @Field(() => CodeType, { nullable: false })
  subjectType: CodeType;

  @Field(() => [CourseTypeGraph], { nullable: true })
  courses: CourseType[];

  @Field(() => String, { nullable: true })
  name?: string;
}
