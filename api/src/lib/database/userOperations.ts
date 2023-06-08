import { user } from "../../../db.ts";
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
  return await user.findMany(fetchOptions);
};

export const getUserByParam = async (param: QueryParam) => {
  return await user.findFirst({
    where: param,
    include: {
      schedules: true,
    },
  });
};

export const createUser = async (userInput: UserInput) => {
  return await user.create({ data: userInput });
};
