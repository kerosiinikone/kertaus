import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { CodeType, type ScheduleSchema } from "../../../../shared/index.js";
import { ScheduleModel } from "../../lib/database/scheduleOperations.js";
import type { ContextType } from "../../types/index.js";
import { requestSchedule } from "../../lib/openai/completions.js";
import {
  authenticationMiddleWare,
  authorizeMiddleware,
  getUserMiddleware,
} from "../../lib/util/middleware/index.js";
import { Schedule, ScheduleInput, ScheduleQueryParams } from "./type.js";

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
    const content: ScheduleSchema = await requestSchedule({
      subject:
        subjectType === CodeType.COURSE
          ? subject.split(": ").join(", josta tarkemmin aihe ")
          : subject,
      subjectType,
      intensity,
      timePeriod,
      courses,
    });

    const schedule = new ScheduleModel(
      content,
      name ??
        (subjectType === CodeType.COURSE ? subject.split(": ")[1] : subject),
      res.locals.user ?? null
    );

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
  async schedule(@Arg("sid") sid: string) {
    return await ScheduleModel.getScheduleById(sid);
  }

  @UseMiddleware(authenticationMiddleWare)
  @Query(() => [Schedule])
  async schedules(
    @Args() { take, offset }: ScheduleQueryParams,
    @Ctx() { res }: ContextType
  ) {
    return await ScheduleModel.getAllSchedules({
      take,
      skip: offset,
      where: {
        authorId: res.locals.user,
      },
    });
  }
}
