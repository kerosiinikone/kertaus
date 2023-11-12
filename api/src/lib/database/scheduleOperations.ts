import { Prisma } from "@prisma/client";
import { schedule } from "../../../db.js";
import {
  ScheduleModelSchema,
  ScheduleSchema,
} from "../../../../shared/index.js";

export interface FetchOptions {
  select?: Prisma.ScheduleSelect;
  include?: Prisma.ScheduleInclude;
  where?: Prisma.ScheduleWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.ScheduleOrderByWithRelationInput>;
  cursor?: Prisma.ScheduleWhereUniqueInput;
  take?: number;
  skip?: number;
}

export class ScheduleModel implements ScheduleModelSchema {
  constructor(
    public content: ScheduleSchema,
    public name?: string,
    public authorId?: string
  ) {}
  async save() {
    return await schedule.create({
      data: {
        name: this.name,
        authorId: this.authorId,
        content: JSON.stringify(this.content),
      },
    });
  }
  static async editSchedule(sid: string, { name }: { name: string }) {
    return await schedule.update({
      where: {
        id: sid,
      },
      data: {
        name,
      },
    });
  }
  static async deleteSchedule(sid: string) {
    return await schedule.delete({
      where: {
        id: sid,
      },
    });
  }
  static async getScheduleById(sid: string) {
    const scheduleResponse = await schedule.findFirst({
      where: {
        id: sid,
      },
    });
    return {
      ...scheduleResponse,
      content: JSON.parse(scheduleResponse.content),
    };
  }

  static async getAllSchedules(fetchOptions: FetchOptions) {
    return await schedule.findMany(fetchOptions);
  }
}
