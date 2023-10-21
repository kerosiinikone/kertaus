import { validate } from "email-validator";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import type { ContextType } from "../../../../../shared/index.js";
import {
  createUser,
  getUserByParam,
} from "../../../lib/database/userOperations.js";
import { authenticationMiddleWare } from "../../../lib/util/middleware/index.js";
import { Cookie } from "../../../lib/util/cookies.js";
import { comparePasswords, hashPassword } from "../../../lib/util/crypt.js";
import { User } from "../type.js";
import { AuthInput } from "./type.js";

@Resolver(User)
export class AuthResolver {
  @Mutation(() => User)
  async register(
    @Arg("input") { email, password }: AuthInput,
    @Ctx() { res }: ContextType
  ): Promise<User> {
    try {
      const user = await getUserByParam({ email });

      if (user) throw Error("User already exists!");

      if (!validate(email)) throw Error("Bad input!");

      const hashedPassword = await hashPassword(password);

      const newUser = await createUser({ email, password: hashedPassword });
      const cookie = new Cookie(newUser);

      cookie.buildTokens();
      cookie.setCookies(res);

      return newUser;
    } catch (error) {}
  }

  @Mutation(() => User)
  async login(
    @Arg("input") { email, password }: AuthInput,
    @Ctx() { res }: ContextType
  ): Promise<User> {
    try {
      const user = await getUserByParam({ email });

      const cookie = new Cookie(user);

      if (!user) throw Error("User doesn't exists!");

      if (!(await comparePasswords(password, user.password)))
        throw Error("Wrong credentials!");

      cookie.buildTokens();
      cookie.setCookies(res);

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authenticationMiddleWare)
  logout(@Ctx() { res }: ContextType): boolean {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return true;
  }
}
