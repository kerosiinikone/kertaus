import { prisma } from "../../../db.ts";
import { Prisma } from "@prisma/client";

export interface FetchOptions {
  select?: Prisma.ScheduleSelect;
  include?: Prisma.ScheduleInclude;
  where?: Prisma.ScheduleWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.ScheduleOrderByWithRelationInput>;
  cursor?: Prisma.ScheduleWhereUniqueInput;
  take?: number;
  skip?: number;
}

export interface ScheduleInput {
  name: string;
  content: string;
  authorId: string;
}

export const getAllSchedules = async (fetchOptions: FetchOptions) => {
  return await prisma.schedule.findMany(fetchOptions);
};

export const getScheduleById = async (sid: string) => {
  return await prisma.schedule.findFirst({
    where: {
      id: sid,
    },
  });
};

export const createSchedule = async (schedule: ScheduleInput) => {
  return await prisma.schedule.create({ data: schedule });
};

export const deleteSchedule = async (sid: string) => {
  return await prisma.schedule.delete({
    where: {
      id: sid,
    },
  });
};
