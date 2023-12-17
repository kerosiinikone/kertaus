import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";
import { User } from "./type.js";
import { getUserByParam } from "../../lib/database/userOperations.js";
import { getUserMiddleware } from "../../lib/util/middleware/index.js";
import type { ContextType } from "../../types/index.js";

@Resolver(User)
export class UserResolver {
  @UseMiddleware(getUserMiddleware)
  @Query(() => User, { nullable: true })
  async me(@Ctx() { res }: ContextType) {
    if (!res.locals.user) return null;
    return await getUserByParam({ id: res.locals.user });
  }
}
