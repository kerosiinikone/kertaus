import { Prisma } from "@prisma/client";
import { schedule } from "../../../db.js";
import { ScheduleModelSchema } from "../../../../shared/index.js";

export interface FetchOptions {
  select?: Prisma.ScheduleSelect;
  include?: Prisma.ScheduleInclude;
  where?: Prisma.ScheduleWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.ScheduleOrderByWithRelationInput>;
  cursor?: Prisma.ScheduleWhereUniqueInput;
  take?: number;
  skip?: number;
}

export class ScheduleDatabaseModel {
  private instance: ScheduleModelSchema;

  constructor(scheduleInstance: ScheduleModelSchema) {
    this.instance = scheduleInstance;
  }
  async save() {
    return await schedule.create({
      data: {
        name: this.instance.name,
        authorId: this.instance.authorId,
        content: JSON.stringify(this.instance.content),
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
