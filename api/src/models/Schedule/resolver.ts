import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  CodeType,
  ScheduleModelSchema,
  type ScheduleSchema,
} from "../../../../shared/index.js";
import { ScheduleDatabaseModel } from "../../lib/database/scheduleOperations.js";
import type { ContextType } from "../../types/index.js";
import { requestSchedule } from "../../lib/openai/completions.js";
import {
  authenticationMiddleWare,
  authorizeMiddleware,
  getUserMiddleware,
} from "../../lib/util/middleware/index.js";
import { Schedule, ScheduleInput, ScheduleQueryParams } from "./type.js";
import ScheduleModel from "./model.js";

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
    const sub =
      subjectType === CodeType.COURSE
        ? subject.split(": ").join(", josta tarkemmin aihe ")
        : subject;

    const content: ScheduleSchema = await requestSchedule({
      subject: sub,
      subjectType,
      intensity,
      timePeriod,
      courses,
    });

    const newSchedule = new ScheduleModel({
      content,
      authorId: res.locals.user || null,
    });

    newSchedule.constructScheduleName(subject, subjectType, name);

    const scheduleData = new ScheduleDatabaseModel(
      newSchedule as ScheduleModelSchema
    );

    if (res.locals.user) {
      await scheduleData.save();
    }
    return newSchedule;
  }

  @UseMiddleware(getUserMiddleware, authorizeMiddleware)
  @Mutation(() => Schedule)
  async deleteSchedule(@Arg("sid") sid: string) {
    return await ScheduleDatabaseModel.deleteSchedule(sid);
  }

  @UseMiddleware(getUserMiddleware, authorizeMiddleware)
  @Mutation(() => Schedule)
  async editSchedule(@Arg("sid") sid: string, @Arg("name") name: string) {
    return await ScheduleDatabaseModel.editSchedule(sid, { name });
  }

  @UseMiddleware(getUserMiddleware, authorizeMiddleware)
  @Query(() => Schedule)
  async schedule(@Arg("sid") sid: string) {
    try {
      return await ScheduleDatabaseModel.getScheduleById(sid);
    } catch (e) {
      throw new Error("Not found");
    }
  }

  @UseMiddleware(authenticationMiddleWare)
  @Query(() => [Schedule])
  async schedules(
    @Args() { take, offset }: ScheduleQueryParams,
    @Ctx() { res }: ContextType
  ) {
    try {
      const schedules = await ScheduleDatabaseModel.getAllSchedules({
        take,
        skip: offset,
        where: {
          authorId: res.locals.user,
        },
      });
      return schedules;
    } catch (e) {
      throw new Error(e);
    }
  }
}
