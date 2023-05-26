import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const startPrisma = async () => {
  await prisma.$connect();
};
