import { Resolver, Query, Args } from "type-graphql";
import { User } from "./type.ts";
import { prisma } from "../../db.ts";

@Resolver(User)
export class UserResolver {
  @Query((returns) => [User])
  async users() {
    return await prisma.user.findMany();
  }
}
