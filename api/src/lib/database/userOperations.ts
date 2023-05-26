import { prisma } from "../../../db.ts";
import { Prisma } from "@prisma/client";

export interface FetchOptions {
  select?: Prisma.UserSelect;
  include?: Prisma.UserInclude;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>;
  cursor?: Prisma.UserWhereUniqueInput;
  take?: number;
  skip?: number;
}

export interface QueryParam {
  email?: string;
  id?: string;
}

export interface UserInput {
  email: string;
  password: string;
  tokenVersion?: number;
}

export const getAllUsers = async (fetchOptions: FetchOptions) => {
  return await prisma.user.findMany(fetchOptions);
};

export const getUserByParam = async (param: QueryParam) => {
  return await prisma.user.findFirst({
    where: param,
  });
};

export const createUser = async (user: UserInput) => {
  return await prisma.user.create({ data: user });
};
