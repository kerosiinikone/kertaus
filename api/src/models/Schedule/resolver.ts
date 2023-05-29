import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Schedule, ScheduleInput } from "./type.ts";
import { requestSchedule } from "../../lib/openai/completions.ts";
import {
  authenticationMiddleWare,
  authorizeMiddleware,
  getUserMiddleware,
} from "../../lib/util/auth/index.ts";
import { ContextType } from "../../../../shared/index.ts";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getScheduleById,
} from "../../lib/database/scheduleOperations.ts";

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

    if (res.locals.user) {
      const schedule = await createSchedule({
        name: name ?? null,
        authorId: res.locals.user,
        content,
      });
      return schedule;
    }
    return {
      content: JSON.parse(content),
      name: name ?? null,
    };
  }

  @UseMiddleware(getUserMiddleware, authenticationMiddleWare)
  @Mutation(() => Schedule)
  async deleteSchedule(@Arg("sid") sid: string) {
    return await deleteSchedule(sid);
  }

  @Query(() => Schedule)
  async getSchedule(@Arg("sid") sid: string) {
    return await getScheduleById(sid);
  }

  @Query(() => [Schedule])
  async getSchedules(
    @Arg("take") take: number,
    @Arg("cursor") cursor?: string,
    @Arg("uid") uid?: string
  ) {
    return await getAllSchedules({
      take,
      skip: cursor ? 1 : 0,
      cursor: { id: cursor ?? null },
      where: {
        authorId: uid ?? null,
      },
    });
  }
}
