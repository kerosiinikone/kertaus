import { Args, Query, Resolver } from "type-graphql";
import { Schedule, ScheduleInput } from "./type.ts";
import { requestSchedule } from "../../lib/openai/completions.ts";

@Resolver(Schedule)
export class ScheduleResolver {
  @Query(() => Schedule)
  async schedule(
    @Args()
    { subject, subjectType, intensity, timePeriod, courses }: ScheduleInput
  ) {
    const response = await requestSchedule({
      subject,
      subjectType,
      intensity,
      timePeriod,
      courses,
    });
    const schedule: Schedule = {
      id: "",
      name: "",
      content: JSON.parse(response),
    };
    return schedule;
  }
}
