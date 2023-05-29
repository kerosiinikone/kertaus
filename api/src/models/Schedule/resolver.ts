import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ContextType } from "../../../../shared/index.ts";
import { ScheduleModel } from "../../lib/database/scheduleModel.ts";
import { requestSchedule } from "../../lib/openai/completions.ts";
import {
  authorizeMiddleware,
  getUserMiddleware,
} from "../../lib/util/auth/index.ts";
import { Schedule, ScheduleInput } from "./type.ts";

@Resolver(Schedule)
export class ScheduleResolver {
  @UseMiddleware(getUserMiddleware)
  @Mutation(() => Schedule)
  async createSchedule(
    @Args()
    {
      subject,
      subjectType,
      intensity,
      timePeriod,
      courses,
      name,
    }: ScheduleInput,
    @Ctx() { res }: ContextType
  ) {
    const content = await requestSchedule({
      subject,
      subjectType,
      intensity,
      timePeriod,
      courses,
    });

    const schedule = new ScheduleModel(content, name, res.locals.user ?? null);

    if (res.locals.user) {
      await schedule.save();
    }
    return schedule;
  }

  @UseMiddleware(getUserMiddleware, authorizeMiddleware)
  @Mutation(() => Schedule)
  async deleteSchedule(@Arg("sid") sid: string) {
    return await ScheduleModel.deleteSchedule(sid);
  }

  @UseMiddleware(getUserMiddleware, authorizeMiddleware)
  @Mutation(() => Schedule)
  async editSchedule(@Arg("sid") sid: string, @Arg("name") name: string) {
    return await ScheduleModel.editSchedule(sid, { name });
  }

  @UseMiddleware(getUserMiddleware, authorizeMiddleware)
  @Query(() => Schedule)
  async getSchedule(@Arg("sid") sid: string) {
    return await ScheduleModel.getScheduleById(sid);
  }

  @Query(() => [Schedule])
  async getSchedules(
    @Arg("take") take: number,
    @Arg("cursor") cursor?: string,
    @Arg("uid") uid?: string
  ) {
    return await ScheduleModel.getAllSchedules({
      take,
      skip: cursor ? 1 : 0,
      cursor: { id: cursor ?? null },
      where: {
        authorId: uid ?? null,
      },
    });
  }
}
