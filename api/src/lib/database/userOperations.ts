import { user as User } from "../../../db.js";
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

interface QueryParam {
  email?: string;
  id?: string;
}

interface UserInput {
  email: string;
  password: string;
  tokenVersion?: number;
}

export const getAllUsers = async (fetchOptions: FetchOptions) => {
  return await User.findMany(fetchOptions);
};

export const getUserByParam = async (param: QueryParam) => {
  return await User.findFirst({
    where: param,
  });
};

export const createUser = async (userInput: UserInput) => {
  return await User.create({ data: userInput });
};
