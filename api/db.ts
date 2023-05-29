import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const { user, schedule } = prisma;

export const startPrisma = async () => {
  await prisma.$connect();
};
